import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ContrastKit HTML content as a string
const contrastKitHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ContrastKit - Color Accessibility Tool</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --danger: #ef4444;
      --success: #10b981;
      --warning: #f59e0b;
      --white: #ffffff;
      --black: #000000;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.5;
    }

    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    .tab-container {
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 1rem;
    }

    .tab-button {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border: none;
      background: none;
      font-weight: 500;
      border-bottom: 2px solid transparent;
    }

    .tab-button.active {
      border-bottom: 2px solid var(--primary);
      color: var(--primary);
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .color-box {
      width: 100%;
      height: 32px;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      position: relative;
      transition: transform 0.1s ease;
    }

    .color-box:hover {
      transform: scale(1.05);
    }

    .color-label {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .color-code {
      font-family: monospace;
      font-size: 0.75rem;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-box {
      width: 100%;
      padding-top: 56.25%; /* 16:9 aspect ratio */
      position: relative;
      border-radius: 4px;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .result-text {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .result-inner {
      position: absolute;
      top: 30%;
      left: 30%;
      right: 30%;
      bottom: 30%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 0.5rem;
    }

    .badge-fail {
      background-color: #fee2e2;
      color: #ef4444;
    }

    .badge-aa-large {
      background-color: #fef3c7;
      color: #d97706;
    }

    .badge-aa {
      background-color: #d1fae5;
      color: #059669;
    }

    .badge-aaa {
      background-color: #bfdbfe;
      color: #3b82f6;
    }

    .matrix-cell {
      width: 60px;
      height: 60px;
      position: relative;
      border: 1px solid #e5e7eb;
    }

    .matrix-cell-inner {
      position: absolute;
      top: 20%;
      left: 20%;
      right: 20%;
      bottom: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .color-tooltip {
      position: absolute;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s ease;
      width: max-content;
      max-width: 200px;
    }

    .color-box:hover .color-tooltip {
      visibility: visible;
      opacity: 1;
    }

    .export-button {
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .export-button:hover {
      background-color: var(--primary-hover);
    }

    .add-button {
      background-color: var(--success);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      margin-top: 0.5rem;
      width: 100%;
    }

    .add-button:hover {
      filter: brightness(1.1);
    }

    .remove-button {
      background-color: var(--danger);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      margin-top: 0.5rem;
      width: 100%;
    }

    .remove-button:hover {
      filter: brightness(1.1);
    }

    /* Toast notification */
    .toast {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background-color: #1f2937;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      z-index: 50;
      opacity: 0;
      transform: translateY(1rem);
      transition: opacity 0.3s ease, transform 0.3s ease;
      max-width: 300px;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .toast-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .toast-message {
      font-size: 0.875rem;
    }

    @media (max-width: 640px) {
      .palette-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  </style>
</head>
<body class="bg-gray-50">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-900">ContrastKit</h1>
    </div>
  </header>

  <main class="app-container">
    <div class="tab-container">
      <button class="tab-button active" data-tab="contrast-checker">Contrast Checker</button>
      <button class="tab-button" data-tab="contrast-matrix">Contrast Matrix</button>
    </div>

    <div id="contrast-checker" class="tab-content active">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Color Palette</h2>
          
          <div id="color-palette-container" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <!-- Color palette items will be added here by JS -->
          </div>

          <div class="flex justify-between mt-4">
            <div class="flex space-x-2">
              <button id="add-color-button" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                Add Color
              </button>
              <button id="clear-palette-button" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                Clear All
              </button>
            </div>
            <div>
              <button id="export-svg-button" class="export-button">
                Export SVG
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Contrast Results</h2>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Foreground Color</label>
            <div id="foreground-selector" class="flex items-center bg-gray-100 p-2 rounded">
              <div id="foreground-preview" class="w-8 h-8 rounded mr-2 border border-gray-300"></div>
              <div>
                <div id="foreground-name" class="text-sm font-medium">Select a color</div>
                <div id="foreground-hex" class="text-xs text-gray-500 font-mono"></div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Background Color</label>
            <div id="background-selector" class="flex items-center bg-gray-100 p-2 rounded">
              <div id="background-preview" class="w-8 h-8 rounded mr-2 border border-gray-300"></div>
              <div>
                <div id="background-name" class="text-sm font-medium">Select a color</div>
                <div id="background-hex" class="text-xs text-gray-500 font-mono"></div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <button id="swap-colors-button" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded text-sm">
              Swap Colors
            </button>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Preview</label>
            <div id="preview-container" class="result-box bg-gray-100">
              <div id="preview-text" class="result-text">
                Sample Text
              </div>
              <div id="preview-inner" class="result-inner">
                Small Text
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Contrast Ratio</label>
            <div class="flex items-center">
              <div id="contrast-ratio" class="text-2xl font-bold mr-2">-</div>
              <div id="compliance-badges" class="flex flex-wrap">
                <!-- Compliance badges will be added by JS -->
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              <div>WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text</div>
              <div>WCAG 2.1 AAA: 7:1 for normal text, 4.5:1 for large text</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="contrast-matrix" class="tab-content">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Contrast Matrix</h2>
          <div class="flex space-x-2">
            <button id="export-matrix-svg" class="export-button">
              Export SVG
            </button>
            <button id="export-matrix-csv" class="export-button">
              Export CSV
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <div id="matrix-container" class="mt-4">
            <!-- Matrix will be added by JS -->
          </div>
        </div>
      </div>
    </div>
  </main>

  <div id="toast" class="toast">
    <div id="toast-title" class="toast-title"></div>
    <div id="toast-message" class="toast-message"></div>
  </div>

  <footer class="bg-white mt-8 py-4 border-t">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
      ContrastKit
    </div>
  </footer>

  <script>
    // State management
    const state = {
      colorPalette: [
        { id: 1, name: "Black", color: "#000000" },
        { id: 2, name: "White", color: "#FFFFFF" },
        { id: 3, name: "Primary Blue", color: "#2563eb" },
        { id: 4, name: "Success Green", color: "#10b981" },
        { id: 5, name: "Danger Red", color: "#ef4444" },
        { id: 6, name: "Warning Yellow", color: "#f59e0b" }
      ],
      nextId: 7,
      foregroundId: 1,
      backgroundId: 2
    };

    // Utility functions
    function hexToRGB(hex) {
      // Remove the hash if it exists
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      
      return [r, g, b];
    }

    function getLuminance(rgb) {
      // Apply gamma correction
      const gammaCorrect = rgb.map(value => {
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      });
      
      // Calculate luminance using the WCAG formula
      return 0.2126 * gammaCorrect[0] + 0.7152 * gammaCorrect[1] + 0.0722 * gammaCorrect[2];
    }

    function calculateContrastRatio(color1, color2) {
      const luminance1 = getLuminance(hexToRGB(color1));
      const luminance2 = getLuminance(hexToRGB(color2));
      
      // Ensure the lighter color is always divided by the darker one
      const lighter = Math.max(luminance1, luminance2);
      const darker = Math.min(luminance1, luminance2);
      
      return (lighter + 0.05) / (darker + 0.05);
    }

    function getComplianceLevel(ratio) {
      if (ratio >= 7) {
        return 'AAA';
      } else if (ratio >= 4.5) {
        return 'AA';
      } else if (ratio >= 3) {
        return 'AA Large';
      } else {
        return 'Fail';
      }
    }

    function getBadgeClass(level) {
      switch (level) {
        case 'AAA':
          return 'badge badge-aaa';
        case 'AA':
          return 'badge badge-aa';
        case 'AA Large':
          return 'badge badge-aa-large';
        default:
          return 'badge badge-fail';
      }
    }

    function getContrastColor(hex) {
      // Convert hex to RGB
      hex = hex.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Calculate luminance (perceived brightness)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Return black for bright colors, white for dark colors
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    function isValidHex(hex) {
      return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
    }

    function formatHex(hex) {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // If it's a 3-character hex, convert to 6-character
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      
      // Add # back and return
      return '#' + hex.toUpperCase();
    }

    function showToast(title, message, duration = 3000) {
      const toast = document.getElementById('toast');
      const toastTitle = document.getElementById('toast-title');
      const toastMessage = document.getElementById('toast-message');
      
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }

    function findColorById(id) {
      return state.colorPalette.find(color => color.id === id);
    }

    function addColorToPalette(color, name) {
      if (state.colorPalette.length >= 12) {
        showToast('Error', 'Maximum 12 colors in palette. Remove some colors first.');
        return false;
      }
      
      const colorHex = formatHex(color);
      
      // Check if the color already exists
      const exists = state.colorPalette.some(c => c.color.toLowerCase() === colorHex.toLowerCase());
      if (exists) {
        showToast('Duplicate Color', 'This color already exists in your palette.');
        return false;
      }
      
      // Add the color to the palette
      const newColor = {
        id: state.nextId++,
        name: name || 'Color ' + (state.colorPalette.length + 1),
        color: colorHex
      };
      
      state.colorPalette.push(newColor);
      renderColorPalette();
      renderContrastMatrix();
      
      return true;
    }

    function removeColorFromPalette(id) {
      // Remove the color
      state.colorPalette = state.colorPalette.filter(color => color.id !== id);
      
      // If we removed the selected foreground or background, reset them
      if (state.foregroundId === id) {
        state.foregroundId = state.colorPalette[0]?.id || 0;
      }
      
      if (state.backgroundId === id) {
        state.backgroundId = state.colorPalette[0]?.id || 0;
      }
      
      renderColorPalette();
      updateContrastChecker();
      renderContrastMatrix();
    }

    function clearColorPalette() {
      if (confirm('Are you sure you want to clear all colors? This cannot be undone.')) {
        state.colorPalette = [];
        state.foregroundId = 0;
        state.backgroundId = 0;
        state.nextId = 1;
        
        renderColorPalette();
        updateContrastChecker();
        renderContrastMatrix();
      }
    }

    function selectAsForeground(id) {
      state.foregroundId = id;
      updateContrastChecker();
    }

    function selectAsBackground(id) {
      state.backgroundId = id;
      updateContrastChecker();
    }

    function swapColors() {
      const temp = state.foregroundId;
      state.foregroundId = state.backgroundId;
      state.backgroundId = temp;
      updateContrastChecker();
    }

    // Render functions
    function renderColorPalette() {
      const container = document.getElementById('color-palette-container');
      container.innerHTML = '';
      
      state.colorPalette.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'relative bg-white p-3 rounded-lg shadow-sm border border-gray-200';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'color-box';
        colorPreview.style.backgroundColor = color.color;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'color-tooltip';
        tooltip.textContent = color.color;
        
        colorPreview.appendChild(tooltip);
        
        const colorName = document.createElement('div');
        colorName.className = 'color-label';
        colorName.textContent = color.name;
        
        const colorCode = document.createElement('div');
        colorCode.className = 'color-code';
        colorCode.textContent = color.color;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex space-x-1 mt-2';
        
        // Foreground button
        const foregroundButton = document.createElement('button');
        foregroundButton.className = 'flex-1 text-xs py-1 rounded ' + 
          (state.foregroundId === color.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300');
        foregroundButton.textContent = 'Text';
        foregroundButton.addEventListener('click', () => selectAsForeground(color.id));
        
        // Background button
        const backgroundButton = document.createElement('button');
        backgroundButton.className = 'flex-1 text-xs py-1 rounded ' + 
          (state.backgroundId === color.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300');
        backgroundButton.textContent = 'BG';
        backgroundButton.addEventListener('click', () => selectAsBackground(color.id));
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'remove-button mt-1';
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => removeColorFromPalette(color.id));
        
        buttonContainer.appendChild(foregroundButton);
        buttonContainer.appendChild(backgroundButton);
        
        colorBox.appendChild(colorPreview);
        colorBox.appendChild(colorName);
        colorBox.appendChild(colorCode);
        colorBox.appendChild(buttonContainer);
        colorBox.appendChild(deleteButton);
        
        container.appendChild(colorBox);
      });
      
      // Add empty state if no colors
      if (state.colorPalette.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-span-full text-center py-8 text-gray-500';
        emptyState.textContent = 'No colors in your palette. Add colors to get started.';
        container.appendChild(emptyState);
      }
    }

    function updateContrastChecker() {
      const foreground = findColorById(state.foregroundId);
      const background = findColorById(state.backgroundId);
      
      // Update preview
      const previewText = document.getElementById('preview-text');
      const previewInner = document.getElementById('preview-inner');
      const previewContainer = document.getElementById('preview-container');
      
      // Update foreground selector
      const foregroundPreview = document.getElementById('foreground-preview');
      const foregroundName = document.getElementById('foreground-name');
      const foregroundHex = document.getElementById('foreground-hex');
      
      // Update background selector
      const backgroundPreview = document.getElementById('background-preview');
      const backgroundName = document.getElementById('background-name');
      const backgroundHex = document.getElementById('background-hex');
      
      // Update contrast ratio and badges
      const contrastRatio = document.getElementById('contrast-ratio');
      const complianceBadges = document.getElementById('compliance-badges');
      
      if (foreground && background) {
        // Set preview colors
        previewContainer.style.backgroundColor = background.color;
        previewText.style.color = foreground.color;
        previewInner.style.color = foreground.color;
        
        // Set selector information
        foregroundPreview.style.backgroundColor = foreground.color;
        foregroundName.textContent = foreground.name;
        foregroundHex.textContent = foreground.color;
        
        backgroundPreview.style.backgroundColor = background.color;
        backgroundName.textContent = background.name;
        backgroundHex.textContent = background.color;
        
        // Calculate contrast ratio
        const ratio = calculateContrastRatio(foreground.color, background.color);
        contrastRatio.textContent = ratio.toFixed(2) + ':1';
        
        // Update compliance badges
        complianceBadges.innerHTML = '';
        
        const level = getComplianceLevel(ratio);
        const badge = document.createElement('div');
        badge.className = getBadgeClass(level);
        badge.textContent = level;
        
        complianceBadges.appendChild(badge);
      } else {
        // Handle case where foreground or background is not selected
        previewContainer.style.backgroundColor = background ? background.color : '#FFFFFF';
        previewText.style.color = foreground ? foreground.color : '#000000';
        previewInner.style.color = foreground ? foreground.color : '#000000';
        
        // Set selector information
        foregroundPreview.style.backgroundColor = foreground ? foreground.color : 'transparent';
        foregroundName.textContent = foreground ? foreground.name : 'Select a color';
        foregroundHex.textContent = foreground ? foreground.color : '';
        
        backgroundPreview.style.backgroundColor = background ? background.color : 'transparent';
        backgroundName.textContent = background ? background.name : 'Select a color';
        backgroundHex.textContent = background ? background.color : '';
        
        // Reset contrast ratio and badges
        contrastRatio.textContent = '-';
        complianceBadges.innerHTML = '';
      }
    }

    function renderContrastMatrix() {
      const container = document.getElementById('matrix-container');
      container.innerHTML = '';
      
      if (state.colorPalette.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-8 text-gray-500';
        emptyState.textContent = 'Add colors to your palette to see the contrast matrix.';
        container.appendChild(emptyState);
        return;
      }
      
      // Create the matrix table
      const table = document.createElement('table');
      table.className = 'border-collapse';
      
      // Create header row
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      // Add empty corner cell
      const cornerCell = document.createElement('th');
      cornerCell.className = 'p-1 text-sm font-medium text-gray-500';
      cornerCell.textContent = 'BG / Text';
      headerRow.appendChild(cornerCell);
      
      // Add columns for each color (as text color)
      state.colorPalette.forEach(color => {
        const th = document.createElement('th');
        th.className = 'p-1';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'w-6 h-6 rounded-full mx-auto';
        colorPreview.style.backgroundColor = color.color;
        colorPreview.title = \`\${color.name} (\${color.color})\`;
        
        th.appendChild(colorPreview);
        headerRow.appendChild(th);
      });
      
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Create table body
      const tbody = document.createElement('tbody');
      
      // Add rows for each color (as background color)
      state.colorPalette.forEach(bgColor => {
        const row = document.createElement('tr');
        
        // Add row header
        const rowHeader = document.createElement('th');
        rowHeader.className = 'p-1';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'w-6 h-6 rounded-full mx-auto';
        colorPreview.style.backgroundColor = bgColor.color;
        colorPreview.title = \`\${bgColor.name} (\${bgColor.color})\`;
        
        rowHeader.appendChild(colorPreview);
        row.appendChild(rowHeader);
        
        // Add cells for each color combination
        state.colorPalette.forEach(textColor => {
          const cell = document.createElement('td');
          cell.className = 'matrix-cell';
          cell.style.backgroundColor = bgColor.color;
          
          const ratio = calculateContrastRatio(textColor.color, bgColor.color);
          const level = getComplianceLevel(ratio);
          
          const inner = document.createElement('div');
          inner.className = 'matrix-cell-inner';
          inner.style.backgroundColor = bgColor.color;
          inner.style.color = textColor.color;
          inner.textContent = Math.round(ratio);
          
          // Add a data attribute for the compliance level
          inner.dataset.level = level;
          
          // Add a border color based on compliance level
          switch (level) {
            case 'AAA':
              inner.style.border = '2px solid #3b82f6';
              break;
            case 'AA':
              inner.style.border = '2px solid #059669';
              break;
            case 'AA Large':
              inner.style.border = '2px solid #d97706';
              break;
            default:
              inner.style.border = '2px solid #ef4444';
              break;
          }
          
          cell.appendChild(inner);
          row.appendChild(cell);
        });
        
        tbody.appendChild(row);
      });
      
      table.appendChild(tbody);
      container.appendChild(table);
    }

    // Export functions
    function generateMatrixSVG() {
      if (state.colorPalette.length === 0) {
        showToast('Error', 'Add colors to your palette before exporting.');
        return;
      }
      
      const palette = state.colorPalette;
      const cellSize = 60;
      const headerSize = 30;
      const padding = 10;
      const fontSize = 12;
      
      const width = headerSize + cellSize * palette.length + padding * 2;
      const height = headerSize + cellSize * palette.length + padding * 2;
      
      let svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${width}" height="\${height}" viewBox="0 0 \${width} \${height}">\`;
      
      // Add title
      svg += \`<text x="\${padding + headerSize + cellSize * palette.length / 2}" y="\${padding}" text-anchor="middle" font-family="Arial" font-size="\${fontSize + 4}" font-weight="bold">ContrastKit Matrix</text>\`;
      
      // Add header text
      svg += \`<text x="\${padding}" y="\${padding + headerSize - 5}" font-family="Arial" font-size="\${fontSize}" fill="#666">BG / Text</text>\`;
      
      // Add column headers (text colors)
      palette.forEach((color, i) => {
        const x = padding + headerSize + i * cellSize + cellSize / 2;
        const y = padding + headerSize / 2;
        
        // Add color circle
        svg += \`<circle cx="\${x}" cy="\${y}" r="\${headerSize / 3}" fill="\${color.color}" stroke="#ccc" stroke-width="1" />\`;
      });
      
      // Add row headers (background colors)
      palette.forEach((bgColor, rowIndex) => {
        const x = padding + headerSize / 2;
        const y = padding + headerSize + rowIndex * cellSize + cellSize / 2;
        
        // Add color circle
        svg += \`<circle cx="\${x}" cy="\${y}" r="\${headerSize / 3}" fill="\${bgColor.color}" stroke="#ccc" stroke-width="1" />\`;
        
        // Add cells for each color combination
        palette.forEach((textColor, colIndex) => {
          const cellX = padding + headerSize + colIndex * cellSize;
          const cellY = padding + headerSize + rowIndex * cellSize;
          
          // Calculate contrast ratio
          const ratio = calculateContrastRatio(textColor.color, bgColor.color);
          const level = getComplianceLevel(ratio);
          
          // Add cell background
          svg += \`<rect x="\${cellX}" y="\${cellY}" width="\${cellSize}" height="\${cellSize}" fill="\${bgColor.color}" stroke="#ccc" stroke-width="1" />\`;
          
          // Add inner rectangle with border color based on compliance
          let borderColor;
          switch (level) {
            case 'AAA': borderColor = '#3b82f6'; break;
            case 'AA': borderColor = '#059669'; break;
            case 'AA Large': borderColor = '#d97706'; break;
            default: borderColor = '#ef4444'; break;
          }
          
          const innerSize = cellSize * 0.6;
          const innerX = cellX + (cellSize - innerSize) / 2;
          const innerY = cellY + (cellSize - innerSize) / 2;
          
          svg += \`<rect x="\${innerX}" y="\${innerY}" width="\${innerSize}" height="\${innerSize}" fill="\${bgColor.color}" stroke="\${borderColor}" stroke-width="2" />\`;
          
          // Add text with contrast ratio
          svg += \`<text x="\${cellX + cellSize / 2}" y="\${cellY + cellSize / 2}" font-family="Arial" font-size="\${fontSize}" fill="\${textColor.color}" text-anchor="middle" dominant-baseline="middle">\${Math.round(ratio)}</text>\`;
        });
      });
      
      svg += '</svg>';
      
      // Create a download link
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contrast-matrix.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Success', 'Matrix exported as SVG.');
    }

    function generateMatrixCSV() {
      if (state.colorPalette.length === 0) {
        showToast('Error', 'Add colors to your palette before exporting.');
        return;
      }
      
      const palette = state.colorPalette;
      let csv = 'Background Color,Background Hex,Text Color,Text Hex,Contrast Ratio,WCAG AA Normal,WCAG AA Large,WCAG AAA Normal,WCAG AAA Large\\n';
      
      palette.forEach(bgColor => {
        palette.forEach(textColor => {
          const ratio = calculateContrastRatio(textColor.color, bgColor.color);
          const passAA = ratio >= 4.5 ? 'Pass' : 'Fail';
          const passAALarge = ratio >= 3 ? 'Pass' : 'Fail';
          const passAAA = ratio >= 7 ? 'Pass' : 'Fail';
          const passAAALarge = ratio >= 4.5 ? 'Pass' : 'Fail';
          
          csv += \`"\${bgColor.name}","\${bgColor.color}","\${textColor.name}","\${textColor.color}",\${Math.round(ratio)},\${passAA},\${passAALarge},\${passAAA},\${passAAALarge}\\n\`;
        });
      });
      
      // Create a download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contrast-matrix.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Success', 'Matrix exported as CSV.');
    }

    // Initialize the application
    function init() {
      // Tab navigation
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Deactivate all tabs
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          // Activate clicked tab
          button.classList.add('active');
          const tabId = button.dataset.tab;
          document.getElementById(tabId).classList.add('active');
        });
      });
      
      // Initialize color palette
      renderColorPalette();
      
      // Initialize contrast checker
      updateContrastChecker();
      
      // Initialize contrast matrix
      renderContrastMatrix();
      
      // Event listeners
      document.getElementById('swap-colors-button').addEventListener('click', swapColors);
      
      document.getElementById('add-color-button').addEventListener('click', () => {
        const hex = prompt('Enter a hex color code (e.g. #FF0000):', '#336699');
        if (hex && isValidHex(hex)) {
          const name = prompt('Enter a name for this color:', 'Custom Color');
          if (name) {
            const added = addColorToPalette(hex, name);
            if (added) {
              showToast('Color Added', \`\${name} has been added to your palette.\`);
            }
          }
        } else if (hex) {
          alert('Please enter a valid hex color code (e.g. #FF0000).');
        }
      });
      
      document.getElementById('clear-palette-button').addEventListener('click', clearColorPalette);
      
      // Export buttons
      document.getElementById('export-svg-button').addEventListener('click', generateMatrixSVG);
      
      document.getElementById('export-matrix-svg').addEventListener('click', generateMatrixSVG);
      document.getElementById('export-matrix-csv').addEventListener('click', generateMatrixCSV);
    }

    // Initialize the application when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;

// Serve the ContrastKit HTML directly
app.get('/', (req, res) => {
  res.send(contrastKitHTML);
});

// Start the server
app.listen(PORT, () => {
  console.log(`ContrastKit server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});