class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.quantity = this.querySelector('input[type="number"]');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartNotification = document.querySelector('cart-notification');
    this.updateSellingPlanId();
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    this.cartNotification.setActiveElement(document.activeElement);
    const submitButton = this.querySelector('[type="submit"]');
    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');
    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    const formData = new FormData(this.form);
    if (this.querySelector('input[name="selling_plan"]')) {
      if (this.querySelector('input[name="selling_plan"]').value != "") {
        formData.set("selling_plan", parseInt(this.querySelector('input[name="selling_plan"]').value));
      } else {
        formData.delete("selling_plan");
      }
    }
    formData.append('sections', this.cartNotification.getSectionsToRender().map((section) => section.id));
    formData.append('sections_url', window.location.pathname);
    config.body = formData;
    this.addCart(config, submitButton);
  }

  updateSellingPlanId() {
    const sellingPlan = this.querySelector('fieldset.selling-plan-fieldset');
    if (sellingPlan) {
      sellingPlan.querySelectorAll('.radio-custom input').forEach((radio) => {
        radio.addEventListener('click', () => {
          if (radio.getAttribute('data-selling-plan-id')) {
            this.querySelector('input[name="selling_plan"]').value = parseInt(radio.getAttribute('data-selling-plan-id'));
          } else {
            this.querySelector('input[name="selling_plan"]').value = null;
          }
        })
      })
    }
  }

  addCart(config, button) {
    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((lineitem) => {
        document.querySelector(button.getAttribute('data-modal'))?.show(lineitem, button, this.quantity?.value < 0 ? 1 : this.quantity?.value, lineitem.status);
        this.cartNotification.renderContents(lineitem);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        button?.classList.remove('loading');
        button?.removeAttribute('disabled');
      });
  }
}

customElements.define('product-form', ProductForm);


