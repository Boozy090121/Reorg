import React from 'react';

const OrgChartConnection = ({ sourceId, targetId, nodes }) => {
  // Find source and target nodes
  const sourceNode = nodes.find(node => node.id === sourceId);
  const targetNode = nodes.find(node => node.id === targetId);
  
  // If either node is not found, don't render the connection
  if (!sourceNode || !targetNode) {
    return null;
  }
  
  // Calculate start and end points
  const startX = sourceNode.position.x;
  const startY = sourceNode.position.y + 40; // Bottom of source node
  const endX = targetNode.position.x;
  const endY = targetNode.position.y - 40; // Top of target node
  
  // Calculate control points for the curve
  const controlPointY = (startY + endY) / 2;
  
  // Create SVG path
  const path = `M ${startX} ${startY} C ${startX} ${controlPointY}, ${endX} ${controlPointY}, ${endX} ${endY}`;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <path
        d={path}
        stroke="#aaa"
        strokeWidth={2}
        fill="none"
        strokeDasharray={sourceNode.isPlaceholder || targetNode.isPlaceholder ? "5,5" : "none"}
      />
    </svg>
  );
};

export default OrgChartConnection;
