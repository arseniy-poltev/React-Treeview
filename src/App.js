import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tree from './CustomTreeview/Tree';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box my={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          React Treeview component
        </Typography>
        <Tree />
      </Box>
    </Container>
  );
}
