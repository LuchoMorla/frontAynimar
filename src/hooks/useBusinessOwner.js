import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useBusinessOwner = (owner) => {
  const { user } = useAuth();
  const [businessOwner, setBusinessOwner] = useState(owner);
  const [business, setBusiness] = useState(owner.business);

  // const checkExistsUser = useCallback(async () => {
  //   // if (!user && !owner) {
  //   //   setBusinessOwner(null);
  //   //   setBusiness([]);
  //   //   return;
  //   // }
  // }, [user]);

  // useEffect(() => {
  //   checkExistsUser();
  // }, [checkExistsUser, user]);

  return [businessOwner, {
    business,
    setBusiness
  }];
}

export default useBusinessOwner;