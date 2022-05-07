import React from 'react';
import PropTypes from 'prop-types';

export default function ChatIcon({
  width = '17',
  height = '19',
  fill = 'white',
}) {
  return (
    <img 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABbklEQVRIie3Wu0oDQRTG8W+CoGUaEQxqZ6V4A9FOEhv1FfQBBFFQFImvY6ev4AULYyEqYmMjKF4iFoJYJBDzt9hsXOIk2d1kt8pXzg7zO8yBsyN1ElOMn01Aj6S0pIykGUkpSb2Vzx+SXiTlJB1JOjHGFFqqCkgCe0Ae/8kDWSAZFp0HngOAtgIWg6I7QLkF1E0Z2PaLbrYBrM1GM3QaKEUA/wCz9dAEcBsB6uYGSLhewmNnJI366ke4jEmas8HLEaJuVmzwRAxw1fDCgzHAQza4Owa4Gi/8GoP3aIMvYoCvbPBBDPD+v5XKALmLcIBcewdILT4JFCNAS8BUw7sA1iOA13w1AlilPT+LMrDlC/Xg2RbRJyBd73x7s518B6r0L2+SdiWNGGOO623qanDAuGXtUlJBUp+kfjmPxXc5w+dczmPv1BhTDFUykAK+PNf2CSyEOiwAOgDkPOgZMBwpWoHvgQfgEFgCfL29O2mWXwcp8gm/uXPRAAAAAElFTkSuQmCC" 
    width={width}
    height={height}
    />
  );
}

ChatIcon.propTypes = {
  /**
   * Width of the icon
   */
  width: PropTypes.string,
  /**
   * Height of the icon
   */
  height: PropTypes.string,
  /**
   * Fill  of the icon should be a valid design system color
   */
  fill: PropTypes.string,
};
