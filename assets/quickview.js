class QuickviewDialog extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      if (event.target.nodeName === 'QUICKVIEW-DIALOG') {
          this.hide();
      }
    });
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this)
    );
    this.addEventListener('keyup', () => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
  }
  show(opener) {
    this.opener = opener;
    var href = this.opener.getAttribute('href');
    var quickview = href.includes("?") ? "?&view=quickview" : "?view=quickview"
    this.setAttribute('open', '');
    fetch(href + quickview)
      .then(response => response.text())
      .then((text) => {
        const parsedHTML = new DOMParser().parseFromString(text, 'text/html');
        parsedHTML.querySelectorAll(".product__media.zoom").forEach((media) => {
          media.classList.remove("zoom");
        })
        var pHtml = "";
        if (typeof ProductForm == 'undefined') {
          // remove script tag
          var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

          parsedHTML.querySelectorAll('noscript link').forEach((link) => {
            pHtml += link.outerHTML;
          })
          parsedHTML.querySelectorAll('script[defer="defer"]').forEach((script) => {
            pHtml += script.outerHTML;
          })
        } else {
          parsedHTML.querySelectorAll('noscript link').forEach((link) => {  
            pHtml += link.outerHTML;
          })
        }
        parsedHTML.querySelectorAll('.container .product .product__media-item').forEach((item) => {
          item.classList.add('quickview-item');
        })
        pHtml += parsedHTML.querySelector('.container .product')?.innerHTML;
        
        this.querySelector('.quickview-popup-content').innerHTML = pHtml;
        
        if (typeof ProductForm == 'undefined') {
          //eval code to trigger event
          var scripts = this.querySelector('.quickview-popup-content').querySelectorAll("script[src]");
          scripts.forEach(function(script){
            getScript(script.getAttribute("src"));
          })
        }
        if (document.querySelector(".selector-wrapper")) {
          document.querySelectorAll('.gp-swatch .option-item').forEach((val) =>{
            val.addEventListener('click', (e) => {
              var option = val.getAttribute('data-option');
              var value = val.getAttribute('data-value');
              var parent = val.parentElement.nodeName;
              val.parentNode.parentNode.querySelector(".selected-value").innerHTML = value;
            });
          });
        }
      })
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.querySelector('quickview-dialog .quickview-popup-content').innerHTML = '';    
    this.removeAttribute('open');
  }
}
customElements.define('quickview-dialog', QuickviewDialog);