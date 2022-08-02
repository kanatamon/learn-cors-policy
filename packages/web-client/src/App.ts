import './index.css';

const API_ENDPOINT = 'http://localhost:4000';

(function init() {
  updateToAuthorizedUI();
})();

(function registerLoginSubmission() {
  const formElm = getSelector<HTMLFormElement>('#login-submission');
  formElm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const res = await fetch(`${API_ENDPOINT}/login`, {
      method: 'POST',
      // @ts-ignore
      body: new URLSearchParams(new FormData(event.target)),
      // TODO: add note what this property let a browser do
      credentials: 'include',
    });

    if (res.ok) {
      updateToAuthorizedUI();
    }

    if (!res.ok) {
      // TODO: handle error
      throw new Error(`NOT IMPLEMENTED YET`);
    }
  });
})();

(function registerLogoutSubmission() {
  const formElm = getSelector<HTMLFormElement>('#logout-submission');
  formElm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const res = await fetch(`${API_ENDPOINT}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      updateToUnauthorizedUI();
    }

    if (!res.ok) {
      // TODO: handle error
      throw new Error(`NOT IMPLEMENTED YET`);
    }
  });
})();

function updateToUnauthorizedUI() {
  const loginFormElm = getSelector<HTMLFormElement>('#login-submission');
  // Reset form's values
  loginFormElm.reset();
  // Show the login-form
  toggleVisibility(loginFormElm, { action: 'show' });

  // Hide account'name and logout's button
  toggleVisibility(getSelector('#logout-submission'), { action: 'hide' });
  toggleVisibility(getSelector('#authorized-header'), { action: 'hide' });
  toggleVisibility(getSelector('#authorized-menu'), { action: 'hide' });
}

async function updateToAuthorizedUI() {
  // Hide the login-form
  toggleVisibility(getSelector('#login-submission'), { action: 'hide' });

  // Show account'name and logout's button
  toggleVisibility(getSelector('#logout-submission'), { action: 'show' });

  const authHeaderElm = getSelector('#authorized-header');
  toggleVisibility(authHeaderElm, { action: 'show' });

  // Display pending state
  authHeaderElm.textContent = 'Logging in...';

  // Request account data
  const res = await fetch(`${API_ENDPOINT}/account`, {
    credentials: 'include',
  });

  if (res.ok) {
    const account = await res.json();

    // Display account's name
    authHeaderElm.textContent = account?.data?.name;

    // Display account' balance
    const balanceElm = getSelector<HTMLInputElement>('#balance');
    balanceElm.value = account?.data?.balance;

    toggleVisibility(getSelector('#authorized-menu'), {
      action: 'show',
      shownDisplay: 'grid',
    });
  }

  if (!res.ok && res.status === 401) {
    updateToUnauthorizedUI();
  }

  if (!res.ok && res.status !== 401) {
    throw new Error(`Unsupported status code: ${res.status}`);
  }
}

function getSelector<TElement extends HTMLElement>(qs: string): TElement {
  const element = document.querySelector<TElement>(qs);
  if (!element) {
    throw new Error(`Element '${qs} is NOT found!`);
  }
  return element;
}

function toggleVisibility(
  element: HTMLElement,
  {
    action,
    shownDisplay = 'block',
  }: { action: 'show' | 'hide'; shownDisplay?: string }
) {
  element.ariaHidden = (action === 'hide').toString();
  element.style.display = action === 'show' ? shownDisplay : 'none';
}
