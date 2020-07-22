import { combineReducers } from 'redux';
import i18n from '../i18n';

const languageDetector = (lng) => {
  let fullLng = 'English';
  if (lng === 'en') fullLng = 'English';
  if (lng === 'ru') fullLng = 'Русский';
  if (lng === 'ukr') fullLng = 'Український';
  return fullLng;
};

const lngShort = (lngRaw) => {
  let lng = 'en';
  if (lngRaw.toLowerCase().slice(0, 2) === 'ru') lng = 'ru';
  if (lngRaw.toLowerCase().slice(0, 3) === 'ukr') lng = 'ukr';
  return lng;
};

const lng = (state = { full: languageDetector(lngShort(localStorage.getItem('i18nextLng'))), short: lngShort(localStorage.getItem('i18nextLng')) }, action) => {
  switch (action.type) {
    case 'CHANGE_LANGUAGE': {
      let shortLng = action.payload;
      if (action.payload === 'English') shortLng = 'en';
      if (action.payload === 'Русский') shortLng = 'ru';
      if (action.payload === 'Український') shortLng = 'ukr';
      i18n.changeLanguage(shortLng);
      return {
        full: action.payload,
        short: shortLng,
      };
    }
    default:
      return state;
  }
};

const user = (state = { isAuth: false }, action) => {
  switch (action.type) {
    case 'ADD_USER': {
      return action.payload;
    }
    case 'ADD_CITY': {
      const newState = { ...state };
      newState.city = action.payload.city;
      newState.country = action.payload.country;
      newState.lookingfora = action.payload.lookingfora;
      newState.lookingforageless = action.payload.lookingforageless;
      newState.lookingforagemore = action.payload.lookingforagemore;
      return newState;
    }
    case 'REMOVE_USER': {
      return { isAuth: false };
    }
    default:
      return state;
  }
};


const coordinates = (state = { lat: 0, lng: 0 }, action) => {
  switch (action.type) {
    case 'CHANGE_COORDINATES': {
      return action.payload;
    }
    default:
      return state;
  }
};

const mapSearchParameters = (state = { parameters: {}, users: [], params: '' }, action) => {
  switch (action.type) {
    case 'ADD_MAP_PARAMETERS': {
      return action.payload;
    }
    case 'CLEAR_MAP_PARAMETERS': {
      return { parameters: {}, users: [] };
    }
    default:
      return state;
  }
};

const chatParameters = (state = '', action) => {
  switch (action.type) {
    case 'ADD_CHAT_PARAMETERS': {
      return action.payload;
    }
    case 'CLEAR_CHAT_PARAMETERS': {
      return '';
    }
    default:
      return state;
  }
};

const error = (state = '', action) => {
  switch (action.type) {
    case 'ADD_ERROR': {
      return action.payload;
    }
    case 'CLEAR_ERROR': {
      return null;
    }
    default:
      return state;
  }
};

const footer = (state = true, action) => {
  switch (action.type) {
    case 'SHOW_FOOTER': {
      return true;
    }
    case 'HIDE_FOOTER': {
      return false;
    }
    default:
      return state;
  }
};

const newMessages = (state = 0, action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGES': {
      return action.payload;
    }
    case 'ADD_MESSAGE': {
      return state + 1;
    }
    case 'REMOVE_MESSAGES': {
      return state - action.payload;
    }
    default:
      return state;
  }
};

export default combineReducers({
  lng,
  user,
  coordinates,
  mapSearchParameters,
  error,
  chatParameters,
  footer,
  newMessages,
});
