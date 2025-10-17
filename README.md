# react-lab-ui

Reusable React UI components for scientific laboratory applications. Built with React, Tailwind CSS, and Material UI.

## Installation

```bash
npm install react-lab-ui
```

Or install from GitHub:

```bash
npm install github:yourusername/react-lab-ui
```

## Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@material-tailwind/react": "^2.1.0",
  "@mui/icons-material": "^7.0.0",
  "@mui/material": "^7.0.0"
}
```

## Components

### Core UI Components

#### ButtonToggle
A toggle button with customizable connected/disconnected states.

```jsx
import { ButtonToggle } from 'react-lab-ui';

<ButtonToggle
  getCurrent={() => isConnected}
  setTarget={(state) => setConnected(state)}
  onClick={(newState) => console.log('Toggled to:', newState)}
  label="Connection"
  connectedColorClass="bg-green-500 text-white"
  disconnectedColorClass="bg-gray-200 text-red-400"
/>
```

#### Card
A styled card container with optional title and subtitle.

```jsx
import { Card } from 'react-lab-ui';

<Card title="Stage Control" subtitle="Wafer positioning">
  <p>Content goes here</p>
</Card>
```

#### Modal
A customizable modal dialog component.

```jsx
import { Modal } from 'react-lab-ui';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleConfirm}
  title="Confirm Action"
  confirmText="Confirm"
>
  <p>Modal content</p>
</Modal>
```

### Connection Components

#### ConnectionControl
A button and status indicator for managing connections.

```jsx
import { ConnectionControl } from 'react-lab-ui';

<ConnectionControl
  isConnected={connected}
  isConnecting={connecting}
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
/>
```

#### ConnectionIndicator
A simple status indicator showing connection/homing/movement state.

```jsx
import { ConnectionIndicator } from 'react-lab-ui';

<ConnectionIndicator
  isConnected={true}
  isHomed={true}
  isMoving={false}
/>
```

### Parameter Control Components

#### ParameterControl
A comprehensive control for motor axes with position display, target input, increment controls, and validation.

```jsx
import { ParameterControl } from 'react-lab-ui';

<ParameterControl
  device={device}
  deviceName="Stage X"
  setTarget={setTargetPosition}
  setIncrement={setIncrementValue}
  onValidationError={(error) => console.warn('Validation error:', error)}
  requiresHome={true}
  showHomeButton={true}
  onHome={handleHome}
  onStop={handleStop}
/>
```

**New callback props:**
- `onValidationError`: Called when a position value is out of range. Receives object with `{ deviceName, requested, min, max, clamped, unit, error }`

#### ParameterInput
A controlled input for editing numeric or text parameters with zustand store integration.

```jsx
import { ParameterInput } from 'react-lab-ui';

<ParameterInput
  id="position"
  label="Position"
  selector={() => position}
  action={(value) => setPosition(Number(value))}
  type="numeric"
  selectOnFocus={true}
/>
```

#### ParameterDisplay
A read-only display for parameter values.

### Data Components

#### FiducialList
A table displaying fiducial coordinates with delete functionality.

```jsx
import { FiducialList } from 'react-lab-ui';

<FiducialList
  fiducials={fiducialArray}
  onDeleteFiducial={(id) => handleDelete(id)}
/>
```

## Tailwind CSS Configuration

These components use Tailwind CSS classes. Make sure your Tailwind configuration includes the necessary colors and utilities:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-lab-ui/src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      // Your custom theme
    },
  },
  plugins: [],
}
```

## Development

This package is designed to be developed alongside your main application. You can link it locally for development:

```bash
cd react-lab-ui
npm link

cd ../your-app
npm link react-lab-ui
```

## License

MIT
