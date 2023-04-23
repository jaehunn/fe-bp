import { Context, useContext as ReactUseContext } from 'react'

export const useContext = <T,>(contextValue: Context<T>) => {
    const context = ReactUseContext(contextValue);

    /** Provider 내부에서 useContext() 를 사용하지 않았다면, 에러를 던진다. */
    if (context === null) {
        throw new Error("must be used within a Provider");
    }

    return context;
}