'use strict';

// DOM Elements
const formEl = document.querySelector('.form');
const textInputEl = document.querySelector('.text-input');
const inputEl = document.querySelector('.input-el');
const btnUploadImage = document.querySelector('.btn-upload-image');
const postsContainer = document.querySelector('.posts');
const imgPreviewEl = document.querySelector('.img-preview');

// State
let state = {
  inputImg: '',
  users: [
    {
      id: '',
      userName: 'Aymane Chaaba',
      userImg:
        'https://pbs.twimg.com/profile_images/1629566120066727937/KjLtBULl_400x400.jpg',
      posts: [],
      loggedIn: true,
      friends: [],
    },
  ],
};

// Render a markup
const render = (markup, parentEl, position = 'afterbegin') => {
  parentEl.insertAdjacentHTML(position, markup);
};

// Update a markup
const update = (newMarkup, parentEl) => {
  parentEl.innerHTML = '';
  parentEl.innerHTML = newMarkup;
};

// Update state
const updateState = (newState) => {
  state = { ...state, ...newState };
};

// Handle ugly input file style
btnUploadImage.addEventListener(
  'click',
  (e) => {
    inputEl?.click();
  },
  false
);

// Get image
const getImage = (e) => {
  const previewImg = (imgPreviewEl, imgUrl) => {
    imgPreviewEl.src = imgUrl;
    imgPreviewEl.classList.remove('hidden');
  };

  const [selectedFile] = e.target.files;
  if (!selectedFile) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const imgUrl = evt.target.result;
    // Add image to our state
    updateState({ inputImg: imgUrl });

    // Preview Image
    previewImg(imgPreviewEl, imgUrl);
  };
  reader.readAsDataURL(selectedFile);

  // Refocus text input
  textInputEl.focus();
};

const formatLikes = (likes) => {
  // Thousand
  if (likes >= 1000) {
    const thousands = likes / 1000;
    return `${thousands}k`;
  }
  return likes;
};

// Generate post markup
const generatePostMarkup = (post) => `
  <div
    data-post-id=${post.id}
    class="post flex flex-col gap-3 border border-slate-200 p-4 rounded-lg"
  >
    <div class="flex items-center gap-3">
      <img
        src=${state.users[0].userImg}
        alt=""
        class="w-10 h-10 rounded-full object-cover"
      />
      <div class="flex flex-col gap-m">
        <div class="text-lg">${state.users[0].userName}</div>
        <div class="text-xs">${new Intl.DateTimeFormat(navigator.location, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(post.timestamp))}</div>
      </div>
    </div>
    <div class="text font-size-2">${post.text}</div>
    ${
      post.imgUrl &&
      `<img
        src=${post.imgUrl}
        alt=""
        class="user-img-post width-full"
      />`
    }
    <div
      class="post-stats border-b pb-2 flex items-center justify-between text-slate-900"
    >
      <div class="likes flex items-start gap-1">
        <span class="font-bold total-likes">${formatLikes(post.likes)}</span>
        <span>Likes</span>
      </div>
      <div class="flex items-start gap-1">
        <span class="total-comments font-bold">${post.comments.length}</span>
        <span>Comments</span>
      </div>
      </div>
    <div class="flex justify-between gap-3 px-2">
      <button class="btn-like-post flex items-center gap-2 cursor-pointer ${
        post.likes >= 1 ? 'text-blue-600' : ''
      }">
        <ion-icon name="thumbs-up"></ion-icon>
        <div>Like</div>
      </button>
      <button class="btn-comment-post flex items-center gap-2 cursor-pointer">
        <ion-icon name="chatbubble" class="text-slate-800"></ion-icon>
        <div class="text-slate-800">Comment</div>
      </button>
      <button
          class="btn-share-post flex items-center gap-2 cursor-pointer"
      >
          <ion-icon name="share-social" class="text-slate-800"></ion-icon>
          <div class="text-slate-800">Share</div>
      </button>
    </div>
    <!-- COMMENT INPUT -->
    <div class="input-comment-container hidden items-center gap-3">
      <img
        src=${state.users[0].userImg}
        alt=""
        class="w-8 h-8 rounded-full object-cover"
      />
      <form
        class="comment-form flex items-center gap-2 flex-1 rounded-full bg-gray-100 py-2 px-4"
      >
        <input
          type="text"
          placeholder="Write a comment..."
          class="comment-input flex-1 bg-transparent border-none outline-none"
        />
        <ion-icon
          name="happy-outline"
          class="cursor-pointer text-lg"
        ></ion-icon>
        <ion-icon
          name="camera-outline"
          class="cursor-pointer text-lg"
        ></ion-icon>
      </form>
    </div>
    <!-- COMMENTS -->
    <div class="comments flex-col gap-2 hidden"></div>
  </div>
  
`;

const generateCommentMarkup = (comment) => `
  <div class="comment flex gap-2" data-comment-id=${comment.id}>
    <img
      src=${state.users[0].userImg}
      alt=""
      class="w-8 h-8 rounded-full object-cover"
    />
    <div class="flex flex-col gap-1 bg-gray-100 rounded-md p-3">
      <div class="username font-bold">${state.users[0].userName}</div>
      <div class="comment-text">${comment.commentText}</div>
    </div>
  </div>
`;

const generatePostsMarkup = (posts) =>
  posts.map((post) => generatePostMarkup(post)).join('');

const getPhoto = (e) => {
  const btn = e.target.closest('.btn-photo-video');
  if (btn) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      console.log(evt.target.result);
    };
  }
};

const addPost = (e) => {
  // Prevent default behaviour
  e.preventDefault();

  // Get text input
  const textVal = textInputEl.value.trim();
  if (!textVal) return;
  updateState({ inputText: textVal });

  // Create a new post object
  const newPost = {
    id: Math.floor(Math.random() * 100) + 1,
    text: textVal,
    imgUrl: state.inputImg,
    timestamp: Date.now(),
    likes: 0,
    comments: [],
  };

  // Add post to posts array in our state
  state.users[0].posts.push(newPost);

  // Clear input field & prev img
  textInputEl.value = '';
  imgPreviewEl.classList.add('hidden');

  // Generate new posts markup
  const newPostMarkup = generatePostMarkup(newPost);

  // Render new Post
  render(newPostMarkup, postsContainer);

  // Reset state
  updateState({ inputImg: '', inputText: '' });
};

const findPost = (e) => {
  const postClicked = e.target.closest('.post');
  const postObj = state.users[0].posts.find(
    (post) => post.id === +postClicked.dataset.postId
  );

  return [postClicked, postObj];
};

const likePost = (e) => {
  // Find post
  const [postClicked, postObj] = findPost(e);

  if (!postClicked || !postObj) return;

  const btnLike = e.target.closest('.btn-like-post');

  if (btnLike) {
    postObj.likes++;

    postClicked.querySelector('.total-likes').textContent = postObj.likes;
    postClicked.querySelector('.btn-like-post').classList.add('text-blue-600');
  }
};

const addComment = (e) => {
  const [postClicked, postObj] = findPost(e);
  if (!postClicked || !postObj) return;

  const totalComments = postClicked.querySelector('.total-comments');
  const btnComment = e.target.closest('.btn-comment-post');
  const commentInput = postClicked.querySelector('.input-comment-container');
  const commentsContainer = postClicked.querySelector('.comments');
  if (!btnComment || !commentInput) return;

  btnComment &&
    ['hidden', 'flex'].forEach((className) =>
      commentInput.classList.toggle(className)
    );

  const form = commentInput.querySelector('.comment-form');

  const add = (e) => {
    e.preventDefault();

    const input = e.target.querySelector('.comment-input');
    if (!input.value) return;

    // Add new comment to state
    const newComment = {
      id: Math.floor(Math.random * 100) + 1,
      commentText: input.value,
      timestamp: Date.now(),
    };
    postObj.comments.push(newComment);

    // Render it
    const newCommentMarkup = generateCommentMarkup(newComment);
    commentsContainer.classList.remove('hidden');
    commentsContainer.classList.add('flex');
    render(newCommentMarkup, commentsContainer);

    // Increment comments count

    totalComments.textContent = postObj.comments.length;

    // Clear input
    input.value = '';
  };

  form.addEventListener('submit', add);
};

const sharePost = (e) => {
  // Find post
  const [postClicked, postObj] = findPost(e);

  const btnShare = e.target.closest('.btn-share-post');

  const share = async function () {
    try {
      if (!navigator.share)
        throw new Error("Your browser doesn't support the Web Share API.");
      await navigator.share({
        url: 'https://www.example.com',
        text: 'my first post',
        title: 'my first post',
      });
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };

  if (btnShare) share();
};

inputEl.addEventListener('change', getImage);
formEl.addEventListener('submit', addPost);
postsContainer.addEventListener('click', likePost);
postsContainer.addEventListener('click', addComment);
postsContainer.addEventListener('click', sharePost);
