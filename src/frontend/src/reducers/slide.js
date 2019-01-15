import { emit } from '../socket';

// reducer with initial state
const initialState = {
  images: [],
  curImage: null,
  newComment: null
};

export const Actions = {
  addComment: (content) => (dispatch) => {
    emit({ type: '@@CLIENT_ADD_COMMENT', payload: { content } });
  }
}

export default function reducer(state = initialState, action) {
  if (action.type === 'SLIDE_CHANGE') {
    const { images, curImage } = action.payload;
    if (images !== undefined && curImage !== undefined) {
      const index = images.findIndex(img => img === curImage)
      // Shift images array to make curImage be the first image
      // so that it would be downloaded first
      action.payload.images = [
        images[index],
        ...images.slice(index + 1),
        ...images.slice(0, index)
      ]
    }
  }
  switch (action.type) {
    case 'SLIDE_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
