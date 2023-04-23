import React, { useRef } from "react";
import { useContext } from "~/lib/react";

let collectionItemID = 1;

type CollectionContextValues = {
  /** Collection 내부에 렌더링된 요소들 */
  items: Map<string, HTMLDivElement>;
};

const CollectionContext = React.createContext<CollectionContextValues | null>(null);
const useCollectionContext = () => useContext(CollectionContext)

const Collection = ({ children }: React.PropsWithChildren<unknown>) => {
  const [items] = React.useState<CollectionContextValues['items']>(new Map());

  return <CollectionContext.Provider value={{ items }}>{children}</CollectionContext.Provider>;
};

const CollectionItem = ({ children }: React.PropsWithChildren<unknown>) => {
  const { items } = useCollectionContext();

  const [id] = React.useState(() => collectionItemID++);

  const itemRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!itemRef?.current) return;

    items.set(`${id}`, itemRef?.current);
  }, []);

  return (
    <div {...{ ["collection-item"]: id }} ref={itemRef}>
      {children}
    </div>
  );
};

function useCollection() {
  const { items } = useCollectionContext();

  const getItems = React.useCallback(() => items.values(), []);

  return {
    getItems
  };
}

Collection.Item = CollectionItem;
Collection.useCollection = useCollection;

export default Collection;
