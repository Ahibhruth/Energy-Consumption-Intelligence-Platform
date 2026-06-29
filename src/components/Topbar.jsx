// /**
//  * Top Navigation Bar Component
//  */

// import '../styles/layout.css';

// export function Topbar({ pageTitle, pageSubtitle }) {
//   return (
//     <div className="topbar">
//       <div>
//         <h2 className="topbar-title">{pageTitle}</h2>
//         <p className="topbar-subtitle">{pageSubtitle}</p>
//       </div>
//       <div className="topbar-right">
//         <span className="badge badge-ok">LIVE</span>
//       </div>
//     </div>
//   );
// }

/**
 * Top Navigation Bar Component
 */

import '../styles/layout.css';

export function Topbar({ pageTitle, pageSubtitle }) {
  return (
    <div className="topbar">
      <div>
        <h2 className="topbar-title">{pageTitle}</h2>
        <p className="topbar-subtitle">{pageSubtitle}</p>
      </div>
      <div className="topbar-right">
        <span className="badge badge-ok">LIVE</span>
      </div>
    </div>
  );
}