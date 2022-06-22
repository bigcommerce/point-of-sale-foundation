/**
 * TabNavItem: a component to represent a tab navigation item
 */
 import React from "react";
 import { useRouter } from 'next/router';
 const TabNavItem = ({id, activeTab, setActiveTab, children}) => {
  const router = useRouter();

  const handleClick = () => {
    setActiveTab(id);
    router.push(`/register?tab=${id}`);
  };

  let classNames = activeTab === id ? "active bg-white shadow-inner" : "bg-slate-100 shadow ";
  classNames += 'flex flex-col justify-center items-center text-center h-full w-1/3 h-16 p-4 list-none cursor-pointer ';

  return (
    <li id={id} onClick={handleClick} className={classNames}>
      { children }
    </li>
  );

};

 export default TabNavItem;