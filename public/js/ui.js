document.addEventListener('DOMContentLoaded', () => {
  // auto-dismiss toasts
  document.querySelectorAll('.toast').forEach(t => {
    setTimeout(() => {
      t.style.transition = 'opacity .4s ease, transform .4s ease';
      t.style.opacity = '0';
      t.style.transform = 'translateY(-8px)';
      setTimeout(() => t.remove(), 500);
    }, 3800);
  });

  // simple keyboard focus ring for accessible visibility
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
  });
});