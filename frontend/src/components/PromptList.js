/**
 * @file PromptList.js
 * @description Displays a scrollable list of prompts with checkboxes, plus edit/delete buttons and a clear selections option.
 *
 * @dependencies
 * - React: For component rendering
 * - Chakra UI (Box, Text, Checkbox, IconButton, Stack, Heading, Flex, Button): UI components
 * - @chakra-ui/icons (DeleteIcon, EditIcon): Action button icons
 *
 * @props
 * - prompts: Array of prompt objects (id, name, content, tags, created_at)
 * - selectedPrompts: Array of selected prompt IDs
 * - onSelectPrompt: Function to toggle prompt selection by ID
 * - onDeletePrompt: Function to delete a prompt by ID
 * - onEditPromptClick: Function to set the editingPrompt state in App
 * - onClearSelections: Function to clear all selected prompts
 *
 * @notes
 * - Each prompt includes a checkbox, content, tags, Edit and Delete buttons.
 * - Checkbox has a data-testid for Cypress targeting, avoiding overlap issues.
 * - Added data-testid to Stack for broader Cypress targeting.
 * - Clear Selections button is enabled when prompts are selected and triggers onClearSelections.
 * - Expandable Prompt List Requirements (to be implemented):
 *   - Display: Checkbox, prompt text, tags, and an expand/collapse toggle button per prompt.
 *   - Collapsed View: Shows first 2-3 lines of prompt text, truncated tag list (with '...' for more), and collapsed state indicator (e.g., ChevronDownIcon).
 *   - Expanded View: Full prompt text (scrollable if long), complete tag list (comma-separated or as badges), metadata (e.g., created_at), and expanded state indicator (e.g., ChevronUpIcon).
 *   - State Persistence: Store expanded/collapsed state in local storage to persist across sessions.
 *   - Bulk Collapse: Add a 'Collapse All' button to collapse all prompts at once.
 *   - Token Count: Display token count per prompt ( overlaps with feature 8; implement minimally here if needed).
 */

import React from 'react';
import {
  Box,
  Text,
  Checkbox,
  IconButton,
  Stack,
  Heading,
  Flex,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const PromptList = ({
  prompts,
  selectedPrompts,
  onSelectPrompt,
  onDeletePrompt,
  onEditPromptClick,
  onClearSelections,
}) => {
  return (
    <Box>
      <Heading as="h2" size="md" mb={3}>
        Prompts
      </Heading>
      <Stack spacing={4} maxH="400px" overflowY="auto" pr={2} data-testid="prompt-list">
        {prompts.length === 0 && (
          <Text fontStyle="italic" color="gray.500">
            No prompts found. Add a new prompt.
          </Text>
        )}
        {prompts.map((prompt) => (
          <Flex
            key={prompt.id}
            borderWidth="1px"
            borderRadius="md"
            p={3}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Wrap Checkbox in a Box for layout consistency */}
            <Box position="relative" mr={3}>
              <Checkbox
                data-testid={`checkbox-${prompt.id}`} // Unique test ID for Cypress
                isChecked={selectedPrompts.includes(prompt.id)}
                onChange={() => onSelectPrompt(prompt.id)}
                alignSelf="center" // Maintain vertical centering
              />
            </Box>
            <Box flex="1">
              <Text fontWeight="bold" noOfLines={1}>
                {prompt.name}
              </Text>
              <Text color="gray.600" noOfLines={2}>
                {prompt.content}
              </Text>
              {prompt.tags && (
                <Text color="gray.600" fontSize="sm">
                  Tags: {prompt.tags}
                </Text>
              )}
            </Box>
            <Flex gap={2}>
              <IconButton
                aria-label="Edit Prompt"
                icon={<EditIcon />}
                size="sm"
                onClick={() =>
                  onEditPromptClick({
                    id: prompt.id,
                    name: prompt.name,
                    content: prompt.content,
                    tags: prompt.tags,
                  })
                }
              />
              <IconButton
                aria-label="Delete Prompt"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => onDeletePrompt(prompt.id)}
              />
            </Flex>
          </Flex>
        ))}
      </Stack>
      {/* Clear Selections Button */}
      {selectedPrompts.length > 0 && (
        <Button
          mt={4}
          colorScheme="blue"
          onClick={onClearSelections}
        >
          Clear Selections
        </Button>
      )}
    </Box>
  );
};

export default PromptList;