import {
  createContext,
  useContext,
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useRef,
  forwardRef,
  Ref,
  useImperativeHandle,
  useEffect,
} from "react";

type OverlayContextValue = {
  mount(id: string, element: ReactNode): void;
  unmount(id: string): void;
};

/** 기본값을 설정할 수도 있겠지만, null 로 설정하고, useContext 를 사용하는 곳에서 가드절로, Provider 로 감싸지않았다는 에러를 노출한다. */
const OverlayContext = createContext<OverlayContextValue | null>(null);
const useOverlayContext = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }: PropsWithChildren<unknown>) => {
  /** key/value 말고, Map 으로 관리하면 어떤 점이 좋을까? */
  const [overlayById, setOverlayById] = useState<Map<string, ReactNode>>(
    new Map()
  );

  /** 의존하는 최신 값이 없으므로, setOverlayById 로 다시 mount 함수를 생성시키지않도록 메모한다. */
  const mount = useCallback((id: string, overlay: ReactNode) => {
    /** 함수형 업데이트를 하는 이유가 있을까? */
    setOverlayById((overlayById) => {
      const newOverlayById = new Map(overlayById);

      newOverlayById.set(id, overlay);

      return newOverlayById;
    });
  }, []);

  /** 의존하는 최신 값이 없으므로, setOverlayById 로 다시 unmount 함수를 생성시키지않도록 메모한다. */
  const unmount = useCallback((id: string) => {
    setOverlayById((overlayById) => {
      const newOverlayById = new Map(overlayById);

      newOverlayById.delete(id);

      return newOverlayById;
    });
  }, []);

  /** 렌더링으로 context 값을 다시 생성시키지않도록 한다. */
  const context = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <OverlayContext.Provider value={context}>
      {/* Provider 는 Overlay 말고 다른 것들을 내포할 수 있다. */}
      {children}

      {/* 더 좋은 방법이 있을까? */}
      {[...overlayById.entries()].map(([id, overlay]) => {
        return <Fragment key={id}>{overlay}</Fragment>;
      })}
    </OverlayContext.Provider>
  );
};

type OverlayControlRef = {
  close: () => void;
};

/** ReactNode > ReactElement > JSX.Element */
type CreateOverlayElement = (props: {
  isOpen: boolean;
  close: () => void;
  exit: () => void;
}) => JSX.Element;

type OverlayControllerProps = {
  overlayElement: CreateOverlayElement;
  onExit: () => void;
};

/** Overlay 로 사용할 컴포넌트의 기본적인 기능을 선언화한다. */
export const OverlayController = forwardRef(
  (
    { overlayElement: OverlayElement, onExit }: OverlayControllerProps,
    forwardedRef: Ref<OverlayControlRef>
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    useImperativeHandle(
      forwardedRef,
      () => {
        return { close: handleClose };
      },
      [handleClose]
    );

    /** 보통 life-cycle 맨 마지막에 useEffect() 을 작성한다. */
    useEffect(() => {
      /** NOTE: requestAnimationFrame이 없으면 가끔 Open 애니메이션이 실행되지 않는다. */
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }, []);

    return <OverlayElement isOpen={isOpen} close={handleClose} exit={onExit} />;
  }
);

/** 자유 변수, 외부에 두어 초기화 되지않도록 한다. */
let elementId = 1;

type useOverlayParams = {
  exitOnUnmount?: boolean;
};

export const useOverlay = ({ exitOnUnmount = true }: useOverlayParams = {}) => {
  const context = useOverlayContext();

  if (!context) {
    /** 일반 return 가드보다 에러를 던지는 것이 좋아보임. */
    throw new Error(`useOverlay must be used within a OverlayProvider`);
  }

  const { mount, unmount } = context;

  /** 후위 연산 1부터 설정, 컴포넌트마다 고유한 ID 가 설정되도록 한다. */
  const [id] = useState(() => String(elementId++));

  const overlayRef = useRef<OverlayControlRef | null>(null);

  useEffect(() => {
    /** 클리어링 */
    return () => {
      if (exitOnUnmount) {
        unmount(id);
      }
    };
  }, [exitOnUnmount, id, unmount]);

  return useMemo(() => {
    return {
      /** Overlay 를 추가하고 연다. */
      open: (overlayElement: CreateOverlayElement) => {
        mount(
          id,
          <OverlayController
            /** key 를 생성 시각으로 설정하는 이유는? */
            key={Date.now()}
            ref={overlayRef}
            overlayElement={overlayElement}
            onExit={() => {
              unmount(id);
            }}
          />
        );
      },
      /** Overlay 를 닫는다. */
      close: () => {
        overlayRef.current?.close();
      },
      /** Overlay 를 overlayById 에서 제거한다. */
      exit: () => {
        unmount(id);
      },
    };
  }, [id, mount, unmount]);
};
