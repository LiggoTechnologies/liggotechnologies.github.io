# AgentTest WPF Application

A simple WPF application for testing agent functionality within the Liggo Technologies CIM system.

## Features

- Simple main window with professional Liggo-branded design
- "Hello World" button that displays a message box when clicked
- Built using .NET 6 and WPF

## Requirements

- .NET 6.0 or later
- Windows OS (required for WPF applications)
- Visual Studio 2022 or compatible development environment

## Building and Running

1. Navigate to the project directory:
   ```
   cd CIM/Applications/AgentTest
   ```

2. Build the application:
   ```
   dotnet build
   ```

3. Run the application:
   ```
   dotnet run
   ```

## Usage

1. Launch the application
2. Click the "Hello World" button in the center of the main window
3. A message box will appear displaying "Hello World!"

## Project Structure

- `AgentTest.csproj` - Project file defining dependencies and build settings
- `App.xaml` - Application definition and startup configuration
- `App.xaml.cs` - Application code-behind
- `MainWindow.xaml` - Main window UI definition
- `MainWindow.xaml.cs` - Main window code-behind with button click handler
- `README.md` - This documentation file
- `.gitignore` - Git ignore rules for build artifacts

## Design Notes

The application uses Liggo's brand color (#4ebf7b) for consistent visual branding across the CIM system.