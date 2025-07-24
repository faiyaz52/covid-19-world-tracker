
import React, { memo, lazy, Suspense } from "react";
import './App.css';

// Lazy load components for better performance
const Header = lazy(() => import("./Containner/Header"));
const DeskBoard = lazy(() => import("./DeskBoard"));

const App = memo(() => {
  return (
    <div>
      <Suspense fallback={<div style={{height: "80px", backgroundColor: "#f8f9fa"}}></div>}>
        <Header/>
      </Suspense>
      <div className="jumbotron">
        <Suspense fallback={
          <div style={{
            textAlign: "center", 
            padding: "50px",
            fontSize: "18px"
          }}>
            Loading dashboard...
          </div>
        }>
          <DeskBoard/> 
        </Suspense>
      </div>
    </div>
  );
});

App.displayName = 'App';
export default App;