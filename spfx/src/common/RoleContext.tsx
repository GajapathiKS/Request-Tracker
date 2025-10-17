import * as React from 'react';

export interface IUserContext {
  isAdmin: boolean;
  displayName?: string;
}

export const RoleContext = React.createContext<IUserContext>({
  isAdmin: false
});
