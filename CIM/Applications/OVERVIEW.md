# CIM Applications Overview

This directory contains Computer Integrated Manufacturing (CIM) applications for Liggo Technologies.

## Applications

### AgentTest
A simple WPF application for testing agent functionality. Located in `AgentTest/` subdirectory.

**Features:**
- Basic WPF interface with Liggo branding
- "Hello World" button functionality
- Message box display on button click
- Built with .NET 8 and WPF

**Usage:**
```
cd AgentTest
dotnet run
```

## Building All Applications

To build the entire CIM Applications solution:
```
dotnet build AgentTest.sln
```

## Requirements

- .NET 8.0 or later
- Windows OS (for WPF applications)
- Visual Studio 2022 or compatible IDE (recommended for development)

## Development Guidelines

- Follow Liggo branding guidelines (use color #4ebf7b)
- Include proper documentation for each application
- Use appropriate .gitignore files to exclude build artifacts
- Write clean, maintainable code with proper error handling