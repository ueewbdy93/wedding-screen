import { emit } from '../socket';


function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nextTop() {
  if (nextTop.slots === undefined) {
    const slots = Array(40).fill(0).map((e, i) => (i * 2) + 5);
    shuffle(slots);
    nextTop.slots = slots;
    nextTop.i = 0;
  } else if (nextTop.i === nextTop.slots.length) {
    shuffle(nextTop.slots);
    nextTop.i = 0;
  }
  return nextTop.slots[nextTop.i++];
}

// reducer with initial state
const initialState = {
  images: [],
  curImage: null,
  newComment: null,
  comments: []
};

export const Actions = {
  addComment: (content) => (dispatch) => {
    emit({ type: '@@CLIENT_ADD_COMMENT', payload: { content } });
  }
}

export default function reducer(state = initialState, action) {
  if (action.type === 'SLIDE_CHANGE') {
    const { images, curImage, newComment } = action.payload;
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
    if (newComment) {
      const now = Date.now()
      action.payload.comments = [
        ...state.comments.filter(({ createAt }) => now - createAt < 11000),
        { ...newComment, createAt: Date.now(), top: `${nextTop()}%` }]
    }
  }
  switch (action.type) {
    case 'SLIDE_CHANGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
