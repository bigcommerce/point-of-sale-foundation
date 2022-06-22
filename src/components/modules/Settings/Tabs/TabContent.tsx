/**
 * TabContent: displays content per each tab, and we can pass any content as child components
 */
 import React from "react";
 
 const TabContent = ({id, activeTab, children}) => {

  return (
    activeTab === id ? <div className="TabContent">
      { children }
    </div>
    : null
  );

 };
  
 export default TabContent;