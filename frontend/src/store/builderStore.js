import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { sectionBlocks, getSectionBlueprint } from '../data/sectionBlocks';
import { getElementPreset } from '../data/elementPresets';
import { getThemePreset } from '../data/themePresets';
import { websiteTemplates, getWebsiteTemplate } from '../data/websiteTemplates';
import { aiMockService } from '../services/aiMockService';
import { projectStorage } from '../services/projectStorage';
import { deepClone } from '../utils/deepClone';
import { createId, rekeyTree } from '../utils/ids';
import { createInteraction, runInteraction as resolveAndRunInteraction, validateInteractions } from '../utils/interactionResolver';
import { slugify } from '../utils/slugify';

const BuilderStoreContext = createContext(null);

const toPageSections = (project, pageId, updater) => {
  const pages = (project.pages || []).map((page) => {
    if (page.id !== pageId) return page;
    const sections = typeof updater === 'function' ? updater(page.sections || []) : updater;
    return { ...page, sections };
  });
  const current = pages.find((page) => page.id === pageId) || pages[0];
  return { ...project, pages, currentPageId: current?.id, sections: current?.sections || [], updatedAt: new Date().toISOString() };
};

const sectionTypes = new Set(sectionBlocks.map((block) => block.type));
const textTypes = new Set(['heading', 'paragraph', 'button', 'card', 'testimonialCard', 'pricingCard', 'productCard']);

const reorder = (items, activeId, overId) => {
  const from = items.findIndex((item) => item.id === activeId);
  const to = items.findIndex((item) => item.id === overId);
  if (from < 0 || to < 0 || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const pxNumber = (value) => {
  const parsed = Number.parseFloat(String(value || '0').replace('px', ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const MIN_ZOOM = 10;
const MAX_ZOOM = 400;

const clampZoom = (value) => {
  const numeric = Number.parseFloat(String(value).replace('%', ''));
  if (!Number.isFinite(numeric)) return 100;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(numeric)));
};

const themedElement = (element, theme) => {
  const colors = theme.colors || {};
  const styles = { ...(element.styles || {}) };

  if (['heading'].includes(element.type)) {
    styles.color = colors.text || styles.color;
    styles.fontFamily = theme.fonts?.heading || styles.fontFamily;
  }

  if (['paragraph', 'socialLinks'].includes(element.type)) {
    styles.color = colors.muted || colors.text || styles.color;
    styles.fontFamily = theme.fonts?.body || styles.fontFamily;
  }

  if (element.type === 'button') {
    styles.backgroundColor = theme.buttonStyle === 'ghost' ? 'transparent' : colors.primary || styles.backgroundColor;
    styles.color = theme.buttonStyle === 'ghost' ? colors.primary || styles.color : '#ffffff';
    styles.border = theme.buttonStyle === 'outline' ? `1px solid ${colors.primary || '#6366f1'}` : styles.border;
    styles.borderRadius = theme.radius || styles.borderRadius;
    styles.boxShadow = theme.shadow || styles.boxShadow;
  }

  if (['card', 'pricingCard', 'testimonialCard', 'productCard', 'form', 'container'].includes(element.type)) {
    styles.backgroundColor = colors.surface || styles.backgroundColor;
    styles.color = colors.text || styles.color;
    styles.border = `1px solid ${colors.muted || '#94a3b8'}33`;
    styles.borderRadius = theme.radius || styles.borderRadius;
    styles.boxShadow = theme.shadow || styles.boxShadow;
  }

  return { ...element, styles };
};

const themedPages = (pages = [], theme) =>
  pages.map((page) => ({
    ...page,
    styles: {
      ...(page.styles || {}),
      backgroundColor: theme.colors?.background || page.styles?.backgroundColor,
      color: theme.colors?.text || page.styles?.color,
      fontFamily: theme.fonts?.body || page.styles?.fontFamily,
    },
    sections: (page.sections || []).map((section, index) => {
      const isFooter = section.type === 'footer';
      const isNavbar = section.type === 'navbar';
      const backgroundColor = isFooter || isNavbar
        ? theme.colors?.background
        : index % 2
          ? theme.colors?.surface
          : theme.colors?.background;

      return {
        ...section,
        styles: {
          ...(section.styles || {}),
          backgroundColor: backgroundColor || section.styles?.backgroundColor,
          color: theme.colors?.text || section.styles?.color,
          fontFamily: theme.fonts?.body || section.styles?.fontFamily,
        },
        elements: (section.elements || []).map((element) => themedElement(element, theme)),
      };
    }),
  }));

export const BuilderProvider = ({ projectId, children }) => {
  const [project, setProjectState] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedInteractionId, setSelectedInteractionId] = useState(null);
  const [activeLeftTool, setActiveLeftTool] = useState('layers');
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [builderMode, setBuilderModeState] = useState('design');
  const [activeTool, setActiveToolState] = useState('select');
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [fullscreenCanvas, setFullscreenCanvas] = useState(false);
  const [zoom, setZoomState] = useState(100);
  const [fitRequestId, setFitRequestId] = useState(0);
  const [connectionDraft, setConnectionDraft] = useState(null);

  const setZoom = useCallback((value) => {
    setZoomState((current) => {
      const nextValue = typeof value === 'function' ? value(current) : value;
      return clampZoom(nextValue);
    });
  }, []);

  const fitToScreen = useCallback(() => {
    setFitRequestId((current) => current + 1);
  }, []);

  const resetZoom = useCallback(() => setZoom(100), [setZoom]);
  const zoomIn = useCallback((step = 10) => setZoom((current) => current + step), [setZoom]);
  const zoomOut = useCallback((step = 10) => setZoom((current) => current - step), [setZoom]);

  const setZoomMode = useCallback((value) => {
    if (value === 'fit') {
      fitToScreen();
      return;
    }
    setZoom(value);
  }, [fitToScreen, setZoom]);

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ id: createId('toast'), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadProject = useCallback((id) => {
    const loaded = id ? projectStorage.getProject(id) : projectStorage.createBlankProject();
    if (!loaded) {
      setProjectState(null);
      showToast('Project not found. Opened a safe empty builder state.', 'error');
      return null;
    }
    setProjectState(loaded);
    setSelectedSectionId(null);
    setSelectedElementId(null);
    setSelectedInteractionId(null);
    setSelectedNodeIds([]);
    setConnectionDraft(null);
    setHistory([]);
    setFuture([]);
    setLastSavedAt(loaded.updatedAt || null);
    return loaded;
  }, [showToast]);

  useEffect(() => {
    loadProject(projectId);
  }, [projectId, loadProject]);

  const commitProject = useCallback((updater, options = {}) => {
    setProjectState((current) => {
      if (!current) return current;
      const before = deepClone(current);
      const next = typeof updater === 'function' ? updater(before) : updater;
      const normalized = projectStorage.normalizeProject({
        ...next,
        updatedAt: new Date().toISOString(),
      });
      if (!options.skipHistory) {
        setHistory((items) => [...items.slice(-39), current]);
        setFuture([]);
      }
      return normalized;
    });
  }, []);

  const currentPage = useMemo(() => {
    if (!project) return null;
    return project.pages?.find((page) => page.id === project.currentPageId) || project.pages?.[0] || null;
  }, [project]);

  const sections = currentPage?.sections || [];
  const selectedSection = sections.find((section) => section.id === selectedSectionId) || null;
  const selectedElement = selectedSection?.elements?.find((element) => element.id === selectedElementId) || null;
  const selectedInteraction = (project?.interactions || []).find((interaction) => interaction.id === selectedInteractionId) || null;
  const selectedItem = selectedElement || selectedSection;
  const selectedKind = selectedInteraction ? 'interaction' : selectedElement ? 'element' : selectedSection ? 'section' : 'page';

  const saveProject = useCallback(async () => {
    if (!project) return null;
    setIsSaving(true);
    try {
      const saved = projectStorage.updateProject(project.id, project);
      setProjectState(saved);
      setLastSavedAt(new Date().toISOString());
      showToast('Project saved to local storage.', 'success');
      return saved;
    } catch (error) {
      showToast('Save failed. Please try again.', 'error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [project, showToast]);

  const publishProject = useCallback(async () => {
    if (!project) return null;
    const saved = projectStorage.updateProject(project.id, project);
    const published = projectStorage.publishProject(saved.id);
    setProjectState(published);
    setLastSavedAt(new Date().toISOString());
    showToast(`Published at /site/${published.slug}`, 'success');
    return published;
  }, [project, showToast]);

  const selectSection = useCallback((sectionId) => {
    setSelectedSectionId(sectionId);
    setSelectedElementId(null);
    setSelectedInteractionId(null);
    setSelectedNodeIds(sectionId ? [sectionId] : []);
  }, []);

  const selectElement = useCallback((sectionId, elementId, options = {}) => {
    setSelectedSectionId(sectionId);
    setSelectedElementId(elementId);
    setSelectedInteractionId(null);
    setSelectedNodeIds((ids) => {
      if (!options.multi) return elementId ? [elementId] : [];
      if (!elementId) return ids;
      return ids.includes(elementId) ? ids.filter((id) => id !== elementId) : [...ids, elementId];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSectionId(null);
    setSelectedElementId(null);
    setSelectedInteractionId(null);
    setSelectedNodeIds([]);
    setConnectionDraft(null);
    setContextMenu(null);
  }, []);

  const selectNode = useCallback((nodeId, options = {}) => {
    if (!nodeId) return clearSelection();
    const section = sections.find((item) => item.id === nodeId);
    const sectionWithElement = sections.find((item) => (item.elements || []).some((element) => element.id === nodeId));
    if (options.multi) {
      setSelectedNodeIds((ids) => (ids.includes(nodeId) ? ids.filter((id) => id !== nodeId) : [...ids, nodeId]));
    } else {
      setSelectedNodeIds([nodeId]);
    }
    if (section) {
      setSelectedSectionId(section.id);
      setSelectedElementId(null);
      setSelectedInteractionId(null);
    } else if (sectionWithElement) {
      setSelectedSectionId(sectionWithElement.id);
      setSelectedElementId(nodeId);
      setSelectedInteractionId(null);
    }
    return true;
  }, [clearSelection, sections]);

  const selectNodes = useCallback((nodeIds = []) => {
    setSelectedNodeIds(nodeIds);
    setSelectedInteractionId(null);
    if (nodeIds.length === 1) return selectNode(nodeIds[0]);
    setSelectedSectionId(null);
    setSelectedElementId(null);
    return true;
  }, [selectNode]);

  const setMode = useCallback((mode) => {
    setBuilderModeState(mode);
    if (mode === 'prototype') {
      setActiveToolState('prototype');
      setActiveLeftTool('pages');
      showToast('Prototype mode enabled. Drag blue handles to connect pages and sections.', 'success');
    } else {
      setActiveToolState('select');
      setConnectionDraft(null);
      setSelectedInteractionId(null);
    }
  }, [showToast]);

  const setActiveTool = useCallback((tool) => {
    setActiveToolState(tool);
    if (tool === 'prototype') {
      setBuilderModeState('prototype');
      setActiveLeftTool('pages');
    } else if (builderMode === 'prototype') {
      setBuilderModeState('design');
    }
  }, [builderMode]);

  const addSection = useCallback((typeOrSection = 'hero') => {
    const section = typeof typeOrSection === 'string' ? rekeyTree(getSectionBlueprint(typeOrSection)) : rekeyTree(typeOrSection);
    commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) => [...items, section]));
    setSelectedSectionId(section.id);
    setSelectedElementId(null);
    showToast(`${section.name || 'Section'} added.`, 'success');
    return section;
  }, [commitProject, showToast]);

  const updateSection = useCallback((sectionId, patch) => {
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) =>
        items.map((section) => (section.id === sectionId ? { ...section, ...patch, styles: { ...(section.styles || {}), ...(patch.styles || {}) } } : section)),
      ),
    );
  }, [commitProject]);

  const deleteSection = useCallback((sectionId = selectedSectionId) => {
    if (!sectionId) return showToast('Select a section first.', 'error');
    commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) => items.filter((section) => section.id !== sectionId)));
    clearSelection();
    showToast('Section deleted.', 'success');
    return true;
  }, [clearSelection, commitProject, selectedSectionId, showToast]);

  const duplicateSection = useCallback((sectionId = selectedSectionId) => {
    const section = sections.find((item) => item.id === sectionId);
    if (!section) return showToast('Select a section first.', 'error');
    const copy = { ...rekeyTree(section), name: `${section.name || 'Section'} Copy` };
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) => {
        const index = items.findIndex((item) => item.id === sectionId);
        const next = [...items];
        next.splice(index + 1, 0, copy);
        return next;
      }),
    );
    setSelectedSectionId(copy.id);
    setSelectedElementId(null);
    showToast('Section duplicated.', 'success');
    return copy;
  }, [commitProject, sections, selectedSectionId, showToast]);

  const moveSection = useCallback((sectionId, direction) => {
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) => {
        const index = items.findIndex((item) => item.id === sectionId);
        const target = direction === 'up' ? index - 1 : index + 1;
        if (index < 0 || target < 0 || target >= items.length) return items;
        const next = [...items];
        const [section] = next.splice(index, 1);
        next.splice(target, 0, section);
        return next;
      }),
    );
  }, [commitProject]);

  const reorderSections = useCallback((activeSectionId, overSectionId) => {
    commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) => reorder(items, activeSectionId, overSectionId)));
    setSelectedSectionId(activeSectionId);
    setSelectedElementId(null);
  }, [commitProject]);

  const addElement = useCallback((type = 'heading', targetSectionId = selectedSectionId, overrides = {}) => {
    if (sectionTypes.has(type)) return addSection(type);

    const preset = getElementPreset(type);
    const element = {
      ...rekeyTree(preset),
      ...overrides,
      styles: { ...(preset.styles || {}), ...(overrides.styles || {}) },
      props: { ...(preset.props || {}), ...(overrides.props || {}) },
      responsive: { ...(preset.responsive || {}), ...(overrides.responsive || {}) },
    };
    const ensureSectionId = targetSectionId || sections[0]?.id;

    if (!ensureSectionId) {
      const section = rekeyTree({
        id: 'section-custom',
        type: 'custom',
        name: 'Custom Section',
        styles: { padding: '72px 64px', backgroundColor: '#ffffff', color: '#0f172a' },
        elements: [element],
      });
      commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) => [...items, section]));
      setSelectedSectionId(section.id);
      setSelectedElementId(section.elements[0].id);
      return section.elements[0];
    }

    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) =>
        items.map((section) =>
          section.id === ensureSectionId ? { ...section, elements: [...(section.elements || []), element] } : section,
        ),
      ),
    );
    setSelectedSectionId(ensureSectionId);
    setSelectedElementId(element.id);
    showToast(`${element.name || type} added.`, 'success');
    return element;
  }, [addSection, commitProject, sections, selectedSectionId, showToast]);

  const updateElement = useCallback((sectionId, elementId, patch) => {
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) =>
        items.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            elements: (section.elements || []).map((element) =>
              element.id === elementId
                ? {
                    ...element,
                    ...patch,
                    styles: { ...(element.styles || {}), ...(patch.styles || {}) },
                    props: { ...(element.props || {}), ...(patch.props || {}) },
                    responsive: { ...(element.responsive || {}), ...(patch.responsive || {}) },
                  }
                : element,
            ),
          };
        }),
      ),
    );
  }, [commitProject]);

  const deleteElement = useCallback((sectionId = selectedSectionId, elementId = selectedElementId) => {
    if (!sectionId || !elementId) return showToast('Select an element first.', 'error');
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) =>
        items.map((section) =>
          section.id === sectionId ? { ...section, elements: (section.elements || []).filter((element) => element.id !== elementId) } : section,
        ),
      ),
    );
    setSelectedElementId(null);
    showToast('Element deleted.', 'success');
    return true;
  }, [commitProject, selectedElementId, selectedSectionId, showToast]);

  const duplicateElement = useCallback((sectionId = selectedSectionId, elementId = selectedElementId) => {
    const section = sections.find((item) => item.id === sectionId);
    const element = section?.elements?.find((item) => item.id === elementId);
    if (!section || !element) return showToast('Select an element first.', 'error');
    const copy = { ...rekeyTree(element), name: `${element.name || 'Element'} Copy` };
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) =>
        items.map((sectionItem) => {
          if (sectionItem.id !== sectionId) return sectionItem;
          const index = sectionItem.elements.findIndex((item) => item.id === elementId);
          const next = [...sectionItem.elements];
          next.splice(index + 1, 0, copy);
          return { ...sectionItem, elements: next };
        }),
      ),
    );
    setSelectedElementId(copy.id);
    showToast('Element duplicated.', 'success');
    return copy;
  }, [commitProject, sections, selectedElementId, selectedSectionId, showToast]);

  const reorderElements = useCallback((activeElementId, activeSectionId, overElementId, overSectionId) => {
    if (!activeElementId || !activeSectionId || !overSectionId) return;
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) => {
        const activeSection = items.find((section) => section.id === activeSectionId);
        const activeElement = activeSection?.elements?.find((element) => element.id === activeElementId);
        if (!activeElement || activeElement.locked) return items;

        if (activeSectionId === overSectionId) {
          return items.map((section) => {
            if (section.id !== activeSectionId) return section;
            return { ...section, elements: reorder(section.elements || [], activeElementId, overElementId) };
          });
        }

        return items.map((section) => {
          if (section.id === activeSectionId) {
            return { ...section, elements: (section.elements || []).filter((element) => element.id !== activeElementId) };
          }
          if (section.id === overSectionId) {
            const nextElements = [...(section.elements || [])];
            const targetIndex = overElementId ? nextElements.findIndex((element) => element.id === overElementId) : -1;
            if (targetIndex >= 0) nextElements.splice(targetIndex, 0, activeElement);
            else nextElements.push(activeElement);
            return { ...section, elements: nextElements };
          }
          return section;
        });
      }),
    );
    setSelectedSectionId(overSectionId);
    setSelectedElementId(activeElementId);
  }, [commitProject]);

  const updateSelectedStyles = useCallback((styles) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, { styles });
    else if (selectedSection) updateSection(selectedSectionId, { styles });
    else showToast('Select a section or element first.', 'error');
  }, [selectedElement, selectedElementId, selectedSection, selectedSectionId, showToast, updateElement, updateSection]);

  const updateSelectedProps = useCallback((props) => {
    if (!selectedElement) return showToast('Select an element first.', 'error');
    updateElement(selectedSectionId, selectedElementId, { props });
    return true;
  }, [selectedElement, selectedElementId, selectedSectionId, showToast, updateElement]);

  const updateSelectedContent = useCallback((content) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, { content });
    else if (selectedSection) updateSection(selectedSectionId, { name: content });
    else showToast('Select text or a section first.', 'error');
  }, [selectedElement, selectedElementId, selectedSection, selectedSectionId, showToast, updateElement, updateSection]);

  const updateSelectedAnimation = useCallback((animation) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, { animation: { ...(selectedElement.animation || {}), ...animation } });
    else if (selectedSection) updateSection(selectedSectionId, { animation: { ...(selectedSection.animation || {}), ...animation } });
    else showToast('Select an item before applying animation.', 'error');
  }, [selectedElement, selectedElementId, selectedSection, selectedSectionId, showToast, updateElement, updateSection]);

  const updateSelectedResponsive = useCallback((deviceOrResponsive, partialResponsive) => {
    const responsive =
      partialResponsive && typeof deviceOrResponsive === 'string'
        ? { [deviceOrResponsive]: { ...((selectedItem?.responsive || {})[deviceOrResponsive] || {}), ...partialResponsive } }
        : deviceOrResponsive;

    if (selectedElement) updateElement(selectedSectionId, selectedElementId, { responsive });
    else if (selectedSection) updateSection(selectedSectionId, { responsive: { ...(selectedSection.responsive || {}), ...responsive } });
    else showToast('Select an item first.', 'error');
  }, [selectedElement, selectedElementId, selectedItem, selectedSection, selectedSectionId, showToast, updateElement, updateSection]);

  const duplicateSelected = useCallback(() => {
    if (selectedElement) return duplicateElement(selectedSectionId, selectedElementId);
    if (selectedSection) return duplicateSection(selectedSectionId);
    showToast('Select a section or element to duplicate.', 'error');
    return null;
  }, [duplicateElement, duplicateSection, selectedElement, selectedElementId, selectedSection, selectedSectionId, showToast]);

  const deleteSelected = useCallback(() => {
    if (selectedInteraction) {
      commitProject((draft) => ({
        ...draft,
        interactions: (draft.interactions || []).filter((interaction) => interaction.id !== selectedInteractionId),
        routes: (draft.routes || []).filter((route) => route.id !== selectedInteractionId),
      }));
      setSelectedInteractionId(null);
      showToast('Prototype connection deleted.', 'success');
      return true;
    }
    if (selectedElement) return deleteElement(selectedSectionId, selectedElementId);
    if (selectedSection) return deleteSection(selectedSectionId);
    showToast('Select a section or element to delete.', 'error');
    return null;
  }, [commitProject, deleteElement, deleteSection, selectedElement, selectedElementId, selectedInteraction, selectedInteractionId, selectedSection, selectedSectionId, showToast]);

  const lockSelected = useCallback(() => {
    if (selectedElement) return updateElement(selectedSectionId, selectedElementId, { locked: !selectedElement.locked });
    if (selectedSection) return updateSection(selectedSectionId, { locked: !selectedSection.locked });
    showToast('Select a section or element to lock.', 'error');
    return null;
  }, [selectedElement, selectedElementId, selectedSection, selectedSectionId, showToast, updateElement, updateSection]);

  const hideSelected = useCallback(() => {
    if (selectedElement) return updateElement(selectedSectionId, selectedElementId, { hidden: !selectedElement.hidden });
    if (selectedSection) return updateSection(selectedSectionId, { hidden: !selectedSection.hidden });
    showToast('Select a section or element to hide.', 'error');
    return null;
  }, [selectedElement, selectedElementId, selectedSection, selectedSectionId, showToast, updateElement, updateSection]);

  const moveElement = useCallback((sectionId, elementId, direction) => {
    commitProject((draft) =>
      toPageSections(draft, draft.currentPageId, (items) =>
        items.map((section) => {
          if (section.id !== sectionId) return section;
          const elements = section.elements || [];
          const index = elements.findIndex((element) => element.id === elementId);
          const target = direction === 'up' ? index - 1 : index + 1;
          if (index < 0 || target < 0 || target >= elements.length) return section;
          const next = [...elements];
          const [element] = next.splice(index, 1);
          next.splice(target, 0, element);
          return { ...section, elements: next };
        }),
      ),
    );
  }, [commitProject]);

  const moveSelectedUp = useCallback(() => {
    if (selectedElement) return moveElement(selectedSectionId, selectedElementId, 'up');
    if (selectedSection) return moveSection(selectedSectionId, 'up');
    return null;
  }, [moveElement, moveSection, selectedElement, selectedElementId, selectedSection, selectedSectionId]);

  const moveSelectedDown = useCallback(() => {
    if (selectedElement) return moveElement(selectedSectionId, selectedElementId, 'down');
    if (selectedSection) return moveSection(selectedSectionId, 'down');
    return null;
  }, [moveElement, moveSection, selectedElement, selectedElementId, selectedSection, selectedSectionId]);

  const openContextMenu = useCallback((position, target = {}) => {
    setContextMenu({ id: createId('menu'), position, target });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const nudgeSelected = useCallback((dx, dy) => {
    const patchNode = (node, patcher) => ({
      ...node,
      styles: {
        ...(node.styles || {}),
        position: node.styles?.position || 'relative',
        left: `${pxNumber(node.styles?.left) + dx}px`,
        top: `${pxNumber(node.styles?.top) + dy}px`,
        ...patcher?.(node),
      },
    });

    if (selectedNodeIds.length > 1) {
      commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) =>
        items.map((section) => {
          const nextSection = selectedNodeIds.includes(section.id) ? patchNode(section) : section;
          return {
            ...nextSection,
            elements: (nextSection.elements || []).map((element) => (selectedNodeIds.includes(element.id) ? patchNode(element) : element)),
          };
        }),
      ));
      return true;
    }

    if (selectedElement) return updateElement(selectedSectionId, selectedElementId, { styles: patchNode(selectedElement).styles });
    if (selectedSection) return updateSection(selectedSectionId, { styles: patchNode(selectedSection).styles });
    return false;
  }, [commitProject, selectedElement, selectedElementId, selectedNodeIds, selectedSection, selectedSectionId, updateElement, updateSection]);

  const alignSelected = useCallback((alignment) => {
    if (!selectedItem) return showToast('Select a node before aligning.', 'error');
    const alignmentStyles = {
      left: { marginLeft: '0', marginRight: 'auto', textAlign: 'left', alignSelf: 'flex-start' },
      center: { marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', alignSelf: 'center' },
      right: { marginLeft: 'auto', marginRight: '0', textAlign: 'right', alignSelf: 'flex-end' },
      top: { alignSelf: 'flex-start' },
      middle: { alignSelf: 'center' },
      bottom: { alignSelf: 'flex-end' },
    }[alignment] || {};
    updateSelectedStyles(alignmentStyles);
    return true;
  }, [selectedItem, showToast, updateSelectedStyles]);

  const copySelected = useCallback(() => {
    if (!selectedItem) return showToast('Select a node to copy.', 'error');
    setClipboard({ kind: selectedElement ? 'element' : 'section', item: deepClone(selectedItem), sectionId: selectedSectionId });
    showToast('Copied selected node.', 'success');
    return true;
  }, [selectedElement, selectedItem, selectedSectionId, showToast]);

  const pasteSelected = useCallback(() => {
    if (!clipboard?.item) return showToast('Clipboard is empty.', 'error');
    if (clipboard.kind === 'section') return duplicateSection(clipboard.item.id);
    const targetSectionId = selectedSectionId || sections[0]?.id;
    if (!targetSectionId) {
      const section = addSection('custom');
      const pasted = { ...rekeyTree(clipboard.item), name: `${clipboard.item.name || 'Element'} Copy` };
      commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) =>
        items.map((item) => (item.id === section.id ? { ...item, elements: [pasted] } : item)),
      ));
      setSelectedSectionId(section.id);
      setSelectedElementId(pasted.id);
      setSelectedNodeIds([pasted.id]);
      return pasted;
    }
    const pasted = { ...rekeyTree(clipboard.item), name: `${clipboard.item.name || 'Element'} Copy` };
    commitProject((draft) => toPageSections(draft, draft.currentPageId, (items) =>
      items.map((section) => (section.id === targetSectionId ? { ...section, elements: [...(section.elements || []), pasted] } : section)),
    ));
    setSelectedSectionId(targetSectionId);
    setSelectedElementId(pasted.id);
    setSelectedNodeIds([pasted.id]);
    showToast('Pasted node.', 'success');
    return pasted;
  }, [addSection, clipboard, commitProject, duplicateSection, sections, selectedSectionId, showToast]);

  const selectAllNodes = useCallback(() => {
    const ids = sections.flatMap((section) => [section.id, ...(section.elements || []).map((element) => element.id)]);
    setSelectedNodeIds(ids);
    setSelectedSectionId(null);
    setSelectedElementId(null);
    setSelectedInteractionId(null);
    showToast(`${ids.length} nodes selected.`);
  }, [sections, showToast]);

  const groupSelected = useCallback(() => {
    if (selectedNodeIds.length < 2) return showToast('Select two or more nodes before grouping.', 'error');
    showToast('Grouping is ready as a structured placeholder; nested container wrapping is the next backend-safe step.');
    return true;
  }, [selectedNodeIds, showToast]);

  const ungroupSelected = useCallback(() => {
    showToast('Ungroup is ready as a structured placeholder for grouped container nodes.');
    return true;
  }, [showToast]);

  const applyTheme = useCallback((themeIdOrTheme) => {
    const theme = typeof themeIdOrTheme === 'string' ? getThemePreset(themeIdOrTheme) : themeIdOrTheme;
    commitProject((draft) => {
      const pages = themedPages(draft.pages || [], theme);
      const current = pages.find((page) => page.id === draft.currentPageId) || pages[0];
      return { ...draft, theme, pages, sections: current?.sections || [] };
    });
    showToast(`${theme.name} theme applied.`, 'success');
  }, [commitProject, showToast]);

  const applyTemplate = useCallback((templateId, mode = 'replace') => {
    const template = getWebsiteTemplate(templateId) || websiteTemplates[0];
    if (!template) return showToast('Template not found.', 'error');
    const pages = rekeyTree(deepClone(template.pages));
    const homePage = pages.find((page) => page.isHome) || pages[0];

    commitProject((draft) => {
      if (mode === 'append') {
        return toPageSections(draft, draft.currentPageId, (items) => [...items, ...rekeyTree(deepClone(template.sections || []))]);
      }
      return {
        ...draft,
        name: draft.name || template.name,
        category: template.category,
        theme: deepClone(template.theme),
        pages,
        currentPageId: homePage?.id,
        sections: homePage?.sections || [],
      };
    });
    setSelectedSectionId(null);
    setSelectedElementId(null);
    showToast(`${template.name} applied.`, 'success');
    return template;
  }, [commitProject, showToast]);

  const generateMockSection = useCallback((type) => {
    const section = aiMockService.generateSection(type, project?.businessDetails || {});
    addSection(section);
  }, [addSection, project]);

  const generateMockWebsite = useCallback(() => {
    const generated = aiMockService.generateWebsite(project?.businessDetails || {});
    const pages = rekeyTree(generated.pages);
    const homePage = pages[0];
    commitProject((draft) => ({
      ...draft,
      theme: generated.theme,
      seo: generated.seo,
      pages,
      currentPageId: homePage.id,
      sections: homePage.sections,
    }));
    showToast('Mock AI website generated.', 'success');
  }, [commitProject, project, showToast]);

  const generateSEO = useCallback(() => {
    const seo = aiMockService.generateSEO(project);
    commitProject((draft) => ({ ...draft, seo: { ...(draft.seo || {}), ...seo } }));
    showToast('Mock SEO generated.', 'success');
  }, [commitProject, project, showToast]);

  const rewriteSelectedText = useCallback((tone = 'professional') => {
    if (!selectedElement || !textTypes.has(selectedElement.type)) return showToast('Select a text-based element first.', 'error');
    const text = typeof selectedElement.content === 'string' ? selectedElement.content : selectedElement.content?.body || selectedElement.content?.title || '';
    const rewritten = aiMockService.rewriteText(text, tone);
    if (typeof selectedElement.content === 'object') {
      updateSelectedContent({ ...selectedElement.content, body: rewritten });
    } else {
      updateSelectedContent(rewritten);
    }
    showToast('Text updated with mock AI.', 'success');
  }, [selectedElement, showToast, updateSelectedContent]);

  const updateProjectSEO = useCallback((seoPatch) => {
    commitProject((draft) => ({
      ...draft,
      slug: seoPatch.slug ? slugify(seoPatch.slug) : draft.slug,
      seo: { ...(draft.seo || {}), ...seoPatch, slug: seoPatch.slug ? slugify(seoPatch.slug) : seoPatch.slug ?? draft.seo?.slug },
    }));
  }, [commitProject]);

  const updateProjectSettings = useCallback((settingsPatch) => {
    commitProject((draft) => ({ ...draft, settings: { ...(draft.settings || {}), ...settingsPatch } }));
  }, [commitProject]);

  const updateProjectMeta = useCallback((metaPatch) => {
    commitProject((draft) => ({
      ...draft,
      ...metaPatch,
      slug: metaPatch.name ? slugify(metaPatch.name) : draft.slug,
    }));
  }, [commitProject]);

  const addAsset = useCallback((asset) => {
    const newAsset = { id: createId('asset'), type: asset.type || 'image', name: asset.name || 'Asset', ...asset };
    commitProject((draft) => ({ ...draft, assets: [newAsset, ...(draft.assets || [])] }));
    showToast('Media added to library.', 'success');
    return newAsset;
  }, [commitProject, showToast]);

  const addPage = useCallback((name = 'New Page') => {
    const page = {
      id: createId('page'),
      type: 'page',
      name,
      slug: slugify(name),
      path: `/${slugify(name)}`,
      isHome: false,
      sections: [],
      styles: { width: '1440px', minHeight: '100vh', backgroundColor: '#ffffff' },
    };
    commitProject((draft) => ({ ...draft, pages: [...(draft.pages || []), page] }));
    showToast(`${name} page added.`, 'success');
    return page;
  }, [commitProject, showToast]);

  const renamePage = useCallback((pageId, name) => {
    commitProject((draft) => ({
      ...draft,
      pages: draft.pages.map((page) => (page.id === pageId ? { ...page, name, slug: slugify(name), path: page.isHome ? '/' : `/${slugify(name)}` } : page)),
    }));
  }, [commitProject]);

  const duplicatePage = useCallback((pageId) => {
    const page = project?.pages?.find((item) => item.id === pageId);
    if (!page) return showToast('Page not found.', 'error');
    const copy = { ...rekeyTree(page), name: `${page.name} Copy`, slug: slugify(`${page.name}-copy`), isHome: false };
    commitProject((draft) => ({ ...draft, pages: [...draft.pages, copy] }));
    showToast('Page duplicated.', 'success');
    return copy;
  }, [commitProject, project, showToast]);

  const deletePage = useCallback((pageId) => {
    if (project?.pages?.length <= 1) return showToast('A project needs at least one page.', 'error');
    const page = project.pages.find((item) => item.id === pageId);
    if (page?.isHome) return showToast('Set another home page before deleting this one.', 'error');
    commitProject((draft) => {
      const pages = draft.pages.filter((item) => item.id !== pageId);
      const currentPageId = draft.currentPageId === pageId ? pages[0].id : draft.currentPageId;
      const current = pages.find((item) => item.id === currentPageId) || pages[0];
      return { ...draft, pages, currentPageId, sections: current.sections };
    });
    showToast('Page deleted.', 'success');
    return true;
  }, [commitProject, project, showToast]);

  const setHomePage = useCallback((pageId) => {
    commitProject((draft) => ({
      ...draft,
      pages: draft.pages.map((page) => ({
        ...page,
        isHome: page.id === pageId,
        path: page.id === pageId ? '/' : `/${page.slug}`,
      })),
    }));
    showToast('Home page updated.', 'success');
  }, [commitProject, showToast]);

  const switchPage = useCallback((pageId) => {
    commitProject((draft) => {
      const page = draft.pages.find((item) => item.id === pageId) || draft.pages[0];
      return { ...draft, currentPageId: page.id, sections: page.sections || [] };
    }, { skipHistory: true });
    clearSelection();
  }, [clearSelection, commitProject]);

  const selectInteraction = useCallback((interactionId) => {
    setSelectedInteractionId(interactionId);
    const interaction = project?.interactions?.find((item) => item.id === interactionId);
    if (interaction?.sourcePageId && interaction.sourcePageId !== project?.currentPageId) {
      const page = project.pages.find((item) => item.id === interaction.sourcePageId);
      if (page) {
        setSelectedSectionId(null);
        setSelectedElementId(null);
        commitProject((draft) => ({ ...draft, currentPageId: page.id, sections: page.sections || [] }), { skipHistory: true });
      }
    }
  }, [commitProject, project]);

  const startConnection = useCallback((sourceNodeId, sourcePageId = currentPage?.id) => {
    if (!sourceNodeId || !sourcePageId) return showToast('Select a source node before connecting.', 'error');
    setBuilderModeState('prototype');
    setConnectionDraft({ sourceNodeId, sourcePageId, position: null, needsTarget: false });
    setSelectedInteractionId(null);
    return true;
  }, [currentPage, showToast]);

  const updateConnectionDrag = useCallback((position) => {
    setConnectionDraft((draft) => (draft ? { ...draft, position } : draft));
  }, []);

  const cancelConnection = useCallback(() => {
    setConnectionDraft(null);
  }, []);

  const addInteraction = useCallback((interactionOrTargetData) => {
    if (!project) return null;
    const interaction =
      interactionOrTargetData?.sourceNodeId && interactionOrTargetData?.sourcePageId
        ? interactionOrTargetData
        : createInteraction(
            interactionOrTargetData?.sourceNodeId || selectedElementId || selectedSectionId,
            interactionOrTargetData?.sourcePageId || currentPage?.id,
            interactionOrTargetData,
          );

    commitProject((draft) => ({
      ...draft,
      interactions: [...(draft.interactions || []), interaction],
      routes: [...(draft.routes || []), { id: interaction.id, sourcePageId: interaction.sourcePageId, sourceNodeId: interaction.sourceNodeId, action: interaction.action, targetPageId: interaction.targetPageId }],
    }));
    setSelectedInteractionId(interaction.id);
    setConnectionDraft(null);
    showToast('Prototype connection created.', 'success');
    return interaction;
  }, [commitProject, currentPage, project, selectedElementId, selectedSectionId, showToast]);

  const completeConnection = useCallback((targetData = {}) => {
    if (!connectionDraft?.sourceNodeId || !connectionDraft?.sourcePageId) {
      showToast('Start from a blue connector handle first.', 'error');
      return null;
    }
    return addInteraction(createInteraction(connectionDraft.sourceNodeId, connectionDraft.sourcePageId, targetData));
  }, [addInteraction, connectionDraft, showToast]);

  const openInteractionModal = useCallback(() => {
    setConnectionDraft((draft) => (draft ? { ...draft, needsTarget: true } : draft));
  }, []);

  const updateInteraction = useCallback((interactionId, updates) => {
    commitProject((draft) => ({
      ...draft,
      interactions: (draft.interactions || []).map((interaction) =>
        interaction.id === interactionId ? { ...interaction, ...updates, updatedAt: new Date().toISOString() } : interaction,
      ),
      routes: (draft.routes || []).map((route) =>
        route.id === interactionId ? { ...route, ...updates } : route,
      ),
    }));
  }, [commitProject]);

  const deleteInteraction = useCallback((interactionId = selectedInteractionId) => {
    if (!interactionId) return showToast('Select a connection first.', 'error');
    commitProject((draft) => ({
      ...draft,
      interactions: (draft.interactions || []).filter((interaction) => interaction.id !== interactionId),
      routes: (draft.routes || []).filter((route) => route.id !== interactionId),
    }));
    setSelectedInteractionId(null);
    showToast('Prototype connection deleted.', 'success');
    return true;
  }, [commitProject, selectedInteractionId, showToast]);

  const runInteraction = useCallback((interactionId, mode = 'editor', navigate) => {
    const interaction = project?.interactions?.find((item) => item.id === interactionId);
    return resolveAndRunInteraction(interaction, project, mode, navigate, {
      currentPageId: project?.currentPageId,
      showToast,
      switchPage,
    });
  }, [project, showToast, switchPage]);

  const runNodeInteraction = useCallback((nodeId, mode = 'preview', navigate) => {
    const interaction = (project?.interactions || []).find((item) => item.sourceNodeId === nodeId);
    if (!interaction) return false;
    return resolveAndRunInteraction(interaction, project, mode, navigate, {
      currentPageId: project?.currentPageId,
      showToast,
      switchPage,
    });
  }, [project, showToast, switchPage]);

  const validateRoutes = useCallback(() => validateInteractions(project), [project]);

  const undo = useCallback(() => {
    setProjectState((current) => {
      if (!history.length || !current) return current;
      const previous = history[history.length - 1];
      setHistory((items) => items.slice(0, -1));
      setFuture((items) => [current, ...items]);
      return previous;
    });
  }, [history]);

  const redo = useCallback(() => {
    setProjectState((current) => {
      if (!future.length || !current) return current;
      const next = future[0];
      setFuture((items) => items.slice(1));
      setHistory((items) => [...items, current]);
      return next;
    });
  }, [future]);

  const value = useMemo(() => ({
    project,
    currentPage,
    sections,
    selectedSectionId,
    selectedElementId,
    selectedInteractionId,
    selectedSection,
    selectedElement,
    selectedInteraction,
    selectedItem,
    selectedKind,
    activeLeftTool,
    activeDevice,
    builderMode,
    activeTool,
    selectedNodeIds,
    clipboard,
    contextMenu,
    snapEnabled,
    canvasPan,
    history,
    future,
    isSaving,
    lastSavedAt,
    previewMode,
    toast,
    leftPanelCollapsed,
    rightPanelCollapsed,
    fullscreenCanvas,
    zoom,
    zoomMode: String(zoom),
    fitRequestId,
    connectionDraft,
    setProject: setProjectState,
    loadProject,
    saveProject,
    publishProject,
    selectSection,
    selectElement,
    selectInteraction,
    clearSelection,
    selectNode,
    selectNodes,
    setMode,
    setActiveTool,
    setSnapEnabled,
    setCanvasPan,
    openContextMenu,
    closeContextMenu,
    nudgeSelected,
    alignSelected,
    copySelected,
    pasteSelected,
    selectAllNodes,
    groupSelected,
    ungroupSelected,
    startConnection,
    updateConnectionDrag,
    completeConnection,
    openInteractionModal,
    cancelConnection,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    runInteraction,
    runNodeInteraction,
    validateRoutes,
    addSection,
    updateSection,
    deleteSection,
    duplicateSection,
    moveSection,
    reorderSections,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    reorderElements,
    updateSelectedStyles,
    updateSelectedProps,
    updateSelectedContent,
    updateSelectedAnimation,
    updateSelectedResponsive,
    duplicateSelected,
    deleteSelected,
    lockSelected,
    hideSelected,
    moveSelectedUp,
    moveSelectedDown,
    applyTheme,
    applyTemplate,
    setActiveLeftTool,
    setActiveDevice,
    setPreviewMode,
    setLeftPanelCollapsed,
    setRightPanelCollapsed,
    setFullscreenCanvas,
    setZoom,
    setZoomMode,
    fitToScreen,
    resetZoom,
    zoomIn,
    zoomOut,
    undo,
    redo,
    generateMockSection,
    generateMockWebsite,
    generateSEO,
    rewriteSelectedText,
    updateProjectSEO,
    updateProjectSettings,
    updateProjectMeta,
    addAsset,
    addPage,
    renamePage,
    duplicatePage,
    deletePage,
    setHomePage,
    switchPage,
    showToast,
  }), [
    activeDevice, activeLeftTool, activeTool, addAsset, addElement, addInteraction, addPage, addSection, alignSelected, applyTemplate, applyTheme,
    builderMode, cancelConnection, canvasPan, clearSelection, clipboard, closeContextMenu, completeConnection, connectionDraft, contextMenu, copySelected, currentPage, deleteElement, deleteInteraction,
    deletePage, deleteSection, deleteSelected, duplicateElement, duplicatePage,
    duplicateSection, duplicateSelected, future, fullscreenCanvas, generateMockSection, generateMockWebsite, generateSEO, groupSelected, hideSelected, history, isSaving,
    fitRequestId, fitToScreen, lastSavedAt, loadProject, moveSection, nudgeSelected, openContextMenu, pasteSelected, previewMode, project, publishProject, redo, renamePage,
    leftPanelCollapsed, lockSelected, moveSelectedDown, moveSelectedUp, reorderElements, reorderSections,
    rewriteSelectedText, runInteraction, runNodeInteraction, saveProject, sections, selectAllNodes, selectElement, selectInteraction, selectNode, selectNodes, selectSection,
    selectedElement, selectedElementId, selectedInteraction, selectedInteractionId,
    selectedItem, selectedKind, selectedNodeIds, selectedSection, selectedSectionId, setActiveTool, setHomePage, setMode, showToast, snapEnabled, switchPage, toast,
    resetZoom, rightPanelCollapsed, setZoom, setZoomMode, ungroupSelected, zoom, zoomIn, zoomOut,
    undo, updateConnectionDrag, updateElement, updateInteraction, updateProjectSEO, updateProjectMeta, updateProjectSettings, updateSection, updateSelectedAnimation,
    updateSelectedContent, updateSelectedProps, updateSelectedResponsive, updateSelectedStyles, validateRoutes,
  ]);

  return React.createElement(BuilderStoreContext.Provider, { value }, children);
};

export const useBuilderStore = () => {
  const context = useContext(BuilderStoreContext);
  if (!context) {
    throw new Error('useBuilderStore must be used inside BuilderProvider');
  }
  return context;
};
