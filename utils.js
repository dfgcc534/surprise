export const state = {
  currentStep: 1,
};

export function goToStep(n) {
  const current = document.querySelector('.screen.active');
  if (current) current.classList.remove('active');

  const next = document.getElementById(`step-${n}`);
  if (next) next.classList.add('active');

  state.currentStep = n;
}
