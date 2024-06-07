class ProductTabMenu extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll(".tab-title").forEach((tab) => tab.addEventListener('click', this.toggleActive.bind(this)));
  }

  toggleActive() {
    event.preventDefault();
    this.querySelectorAll(".tab-title").forEach((tab) => tab.classList.remove('active'));
    var href = event.target.getAttribute("href");
    event.target.parentNode.classList.add("active")
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove('active'));
    document.getElementById(href.replace("#",""))?.classList.add("active");
    document.querySelectorAll(".tab-content-mobile").forEach((tabmobile) => {
      tabmobile.classList.remove('active');
      if(tabmobile.getAttribute("data-id") && tabmobile.getAttribute("data-id").includes(href.replace("#",""))) {
        tabmobile.classList.add('active');
      }
    }); 
  }

}
customElements.define("tab-menu", ProductTabMenu)