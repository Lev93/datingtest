export const changeLanguage = (lng) => ({
  type: 'CHANGE_LANGUAGE',
  payload: lng,
});

export const addUser = (user) => ({
  type: 'ADD_USER',
  payload: user,
});

export const removeUser = () => ({
  type: 'REMOVE_USER',
});

export const changeCoordinates = (coordinates) => ({
  type: 'CHANGE_COORDINATES',
  payload: coordinates,
});

export const addMapParameters = (parameters) => ({
  type: 'ADD_MAP_PARAMETERS',
  payload: parameters,
});

export const clearMapParameters = (parameters) => ({
  type: 'CLEAR_MAP_PARAMETERS',
  payload: parameters,
});

export const addError = (error) => ({
  type: 'ADD_ERROR',
  payload: error,
});

export const clearError = (error) => ({
  type: 'CLEAR_ERROR',
  payload: error,
});

export const addChatParameters = (parameters) => ({
  type: 'ADD_CHAT_PARAMETERS',
  payload: parameters,
});

export const clearChatParameters = (parameters) => ({
  type: 'CLEAR_CHAT_PARAMETERS',
  payload: parameters,
});

export const showFooter = () => ({
  type: 'SHOW_FOOTER',
});

export const hideFooter = () => ({
  type: 'HIDE_FOOTER',
});

export const updateNewMessages = (count) => ({
  type: 'UPDATE_MESSAGES',
  payload: count,
});

export const addMessage = () => ({
  type: 'ADD_MESSAGE',
});

export const removeMessages = (count) => ({
  type: 'REMOVE_MESSAGES',
  payload: count,
});

export const addCity = (count) => ({
  type: 'ADD_CITY',
  payload: count,
});
