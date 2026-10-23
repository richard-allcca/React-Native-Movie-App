/**
 * @format
 */

import React from 'react';
import {it, jest} from '@jest/globals';
import TestRenderer, {act} from 'react-test-renderer';
import App from '../App';

jest.mock('../src/presentation/navigation/Navigation', () => {
  const ReactLib = require('react');
  const {Text} = require('react-native');
  return {
    Navigation: () => ReactLib.createElement(Text, null, 'Navigation'),
  };
});

jest.mock('../src/composition/movies', () => ({
  Movies: {
    nowPlaying: jest.fn(() => Promise.resolve([])),
    upcoming: jest.fn(() => Promise.resolve([])),
    topRated: jest.fn(() => Promise.resolve([])),
    popular: jest.fn(() => Promise.resolve([])),
    byId: jest.fn(),
    cast: jest.fn(),
    search: jest.fn(() => Promise.resolve([])),
  },
}));

it('renders correctly', async () => {
  await act(async () => {
    TestRenderer.create(<App />);
  });
});
