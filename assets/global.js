function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = ";SameSite=None;Secure;expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getScript(source, callback) {
  var script = document.createElement('script');
  var prior = document.getElementsByTagName('script')[0];
  script.async = 1;

  script.onload = script.onreadystatechange = function( _, isAbort ) {
      if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
          script.onload = script.onreadystatechange = null;
          script = undefined;

          if(!isAbort && callback) setTimeout(callback, 0);
      }
  };

  script.src = source;
  prior.parentNode.insertBefore(script, prior);
}
function calcWidthDropdownMenu() {
  var parentmenu = document.querySelectorAll(".site-header .nav-megamenu .level0");
  var megamenusub = document.querySelectorAll(".site-header .nav-megamenu .dropdown-menu");
        
  var wdw = window.innerWidth;
  var wdh = window.innerHeight;
  var wdw2 = document.querySelector('body').clientWidth;
  if (wdw > 1024) {
    for (var i = 0; i < parentmenu.length; i++) {
      if(parentmenu[i].querySelector(".dropdown-menu")) {
        var getClassMegamenu = parentmenu[i].querySelector(".dropdown-menu").getAttribute('class');
        const lioffsetLeft = parentmenu[i].offsetLeft;
        const liWidth = parentmenu[i].clientWidth;
        const lioffsetRight = wdw2 - lioffsetLeft - liWidth;
        const dropdownMegamenu = parentmenu[i].querySelector(".dropdown-menu").clientWidth*2;
        
        if (getClassMegamenu.includes("normal-menu")) {
          if (lioffsetRight < dropdownMegamenu) {
            parentmenu[i].querySelectorAll(".dropdown-menu").forEach(element => {
                element.classList.add('leftside');
            });;
          }
        }
      
        if(!document.querySelector('.header3')){
          var megamenu_sub = $("." + megamenusub[i].getAttribute('class').replaceAll(' ', '.'));
          if (getClassMegamenu.includes("fullwidthfluid")) {
            if(!document.querySelector('.header3')){
              megamenu_sub.offset({left: 0});
              megamenu_sub.css('transform','unset!important');
            }
          }
        } 
      }
    }
  }
}
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}
document.addEventListener('DOMContentLoaded', (event) => {
  calcWidthDropdownMenu();
  // close input search
  document.querySelectorAll(".search-close").forEach( (close) => {
    close.addEventListener("click", function() {
      close.parentNode.querySelector("input[type='search']").value ="";
    })
  })
  // Label inside input hover go up
  document.querySelectorAll('input, select, textarea').forEach((focused) => {
    if(focused.value != '') {
      if(focused.closest('.field-wrapper')) {
        focused.closest('.field-wrapper').classList.add('focused');
      }
    }
    if(focused + ':not(:placeholder-shown)') {
      if(focused.closest('.field-wrapper')) {
        focused.closest('.field-wrapper').classList.add('focused');
      }
    }
    if(focused.value.length > 0) {
      if(focused.closest('.field-wrapper')) {
        focused.closest('.field-wrapper').classList.add('focused');
      }
    }

    focused.addEventListener('focus', (event) => {
      if(event.target.closest('.field-wrapper')){
        event.target.closest('.field-wrapper').classList.add('focused');
      }
    });
    focused.addEventListener('blur', (event) => {
      if(event.target.closest('.field-wrapper') && event.target.value== '') {
        event.target.closest('.field-wrapper').classList.remove('focused');
      }
    });
  })


  // Show hide password
  document.querySelectorAll('.field-wrapper').forEach((eye) => {
    if(eye.querySelector('.password-eye')) {
      eye.querySelector('.password-eye').addEventListener('click', (event) => {
        if(eye.querySelector('input').type == 'password'){
          eye.querySelector('input').type = 'text'
          eye.querySelector('.password-eye').classList.add('show');
        }else {
          eye.querySelector('input').type = 'password';
          eye.querySelector('.password-eye').classList.remove('show');
        }
      });
    }
  });
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

});
window.addEventListener("resize", () => {
  calcWidthDropdownMenu();
});
const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => model.modelViewerUI?.pause());
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

var moneyFormats={USD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} USD"},EUR:{money_format:"&euro;{{amount}}",money_with_currency_format:"&euro;{{amount}} EUR"},GBP:{money_format:"&pound;{{amount}}",money_with_currency_format:"&pound;{{amount}} GBP"},CAD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} CAD"},ALL:{money_format:"Lek {{amount}}",money_with_currency_format:"Lek {{amount}} ALL"},DZD:{money_format:"DA {{amount}}",money_with_currency_format:"DA {{amount}} DZD"},AOA:{money_format:"Kz{{amount}}",money_with_currency_format:"Kz{{amount}} AOA"},ARS:{money_format:"${{amount_with_comma_separator}}",money_with_currency_format:"${{amount_with_comma_separator}} ARS"},AMD:{money_format:"{{amount}} AMD",money_with_currency_format:"{{amount}} AMD"},AWG:{money_format:"Afl{{amount}}",money_with_currency_format:"Afl{{amount}} AWG"},AUD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} AUD"},BBD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} Bds"},AZN:{money_format:"m.{{amount}}",money_with_currency_format:"m.{{amount}} AZN"},BDT:{money_format:"Tk {{amount}}",money_with_currency_format:"Tk {{amount}} BDT"},BSD:{money_format:"BS${{amount}}",money_with_currency_format:"BS${{amount}} BSD"},BHD:{money_format:"{{amount}}0 BD",money_with_currency_format:"{{amount}}0 BHD"},BYR:{money_format:"Br {{amount}}",money_with_currency_format:"Br {{amount}} BYR"},BZD:{money_format:"BZ${{amount}}",money_with_currency_format:"BZ${{amount}} BZD"},BTN:{money_format:"Nu {{amount}}",money_with_currency_format:"Nu {{amount}} BTN"},BAM:{money_format:"KM {{amount_with_comma_separator}}",money_with_currency_format:"KM {{amount_with_comma_separator}} BAM"},BRL:{money_format:"R$ {{amount_with_comma_separator}}",money_with_currency_format:"R$ {{amount_with_comma_separator}} BRL"},BOB:{money_format:"Bs{{amount_with_comma_separator}}",money_with_currency_format:"Bs{{amount_with_comma_separator}} BOB"},BWP:{money_format:"P{{amount}}",money_with_currency_format:"P{{amount}} BWP"},BND:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} BND"},BGN:{money_format:"{{amount}} лв",money_with_currency_format:"{{amount}} лв BGN"},MMK:{money_format:"K{{amount}}",money_with_currency_format:"K{{amount}} MMK"},KHR:{money_format:"KHR{{amount}}",money_with_currency_format:"KHR{{amount}}"},KYD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} KYD"},XAF:{money_format:"FCFA{{amount}}",money_with_currency_format:"FCFA{{amount}} XAF"},CLP:{money_format:"${{amount_no_decimals}}",money_with_currency_format:"${{amount_no_decimals}} CLP"},CNY:{money_format:"&#165;{{amount}}",money_with_currency_format:"&#165;{{amount}} CNY"},COP:{money_format:"${{amount_with_comma_separator}}",money_with_currency_format:"${{amount_with_comma_separator}} COP"},CRC:{money_format:"&#8353; {{amount_with_comma_separator}}",money_with_currency_format:"&#8353; {{amount_with_comma_separator}} CRC"},HRK:{money_format:"{{amount_with_comma_separator}} kn",money_with_currency_format:"{{amount_with_comma_separator}} kn HRK"},CZK:{money_format:"{{amount_with_comma_separator}} K&#269;",money_with_currency_format:"{{amount_with_comma_separator}} K&#269;"},DKK:{money_format:"{{amount_with_comma_separator}}",money_with_currency_format:"kr.{{amount_with_comma_separator}}"},DOP:{money_format:"RD$ {{amount}}",money_with_currency_format:"RD$ {{amount}}"},XCD:{money_format:"${{amount}}",money_with_currency_format:"EC${{amount}}"},EGP:{money_format:"LE {{amount}}",money_with_currency_format:"LE {{amount}} EGP"},ETB:{money_format:"Br{{amount}}",money_with_currency_format:"Br{{amount}} ETB"},XPF:{money_format:"{{amount_no_decimals_with_comma_separator}} XPF",money_with_currency_format:"{{amount_no_decimals_with_comma_separator}} XPF"},FJD:{money_format:"${{amount}}",money_with_currency_format:"FJ${{amount}}"},GMD:{money_format:"D {{amount}}",money_with_currency_format:"D {{amount}} GMD"},GHS:{money_format:"GH&#8373;{{amount}}",money_with_currency_format:"GH&#8373;{{amount}}"},GTQ:{money_format:"Q{{amount}}",money_with_currency_format:"{{amount}} GTQ"},GYD:{money_format:"G${{amount}}",money_with_currency_format:"${{amount}} GYD"},GEL:{money_format:"{{amount}} GEL",money_with_currency_format:"{{amount}} GEL"},HNL:{money_format:"L {{amount}}",money_with_currency_format:"L {{amount}} HNL"},HKD:{money_format:"${{amount}}",money_with_currency_format:"HK${{amount}}"},HUF:{money_format:"{{amount_no_decimals_with_comma_separator}}",money_with_currency_format:"{{amount_no_decimals_with_comma_separator}} Ft"},ISK:{money_format:"{{amount_no_decimals}} kr",money_with_currency_format:"{{amount_no_decimals}} kr ISK"},INR:{money_format:"Rs. {{amount}}",money_with_currency_format:"Rs. {{amount}}"},IDR:{money_format:"{{amount_with_comma_separator}}",money_with_currency_format:"Rp {{amount_with_comma_separator}}"},ILS:{money_format:"{{amount}} NIS",money_with_currency_format:"{{amount}} NIS"},JMD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} JMD"},JPY:{money_format:"&#165;{{amount_no_decimals}}",money_with_currency_format:"&#165;{{amount_no_decimals}} JPY"},JEP:{money_format:"&pound;{{amount}}",money_with_currency_format:"&pound;{{amount}} JEP"},JOD:{money_format:"{{amount}}0 JD",money_with_currency_format:"{{amount}}0 JOD"},KZT:{money_format:"{{amount}} KZT",money_with_currency_format:"{{amount}} KZT"},KES:{money_format:"KSh{{amount}}",money_with_currency_format:"KSh{{amount}}"},KWD:{money_format:"{{amount}}0 KD",money_with_currency_format:"{{amount}}0 KWD"},KGS:{money_format:"лв{{amount}}",money_with_currency_format:"лв{{amount}}"},LVL:{money_format:"Ls {{amount}}",money_with_currency_format:"Ls {{amount}} LVL"},LBP:{money_format:"L&pound;{{amount}}",money_with_currency_format:"L&pound;{{amount}} LBP"},LTL:{money_format:"{{amount}} Lt",money_with_currency_format:"{{amount}} Lt"},MGA:{money_format:"Ar {{amount}}",money_with_currency_format:"Ar {{amount}} MGA"},MKD:{money_format:"ден {{amount}}",money_with_currency_format:"ден {{amount}} MKD"},MOP:{money_format:"MOP${{amount}}",money_with_currency_format:"MOP${{amount}}"},MVR:{money_format:"Rf{{amount}}",money_with_currency_format:"Rf{{amount}} MRf"},MXN:{money_format:"$ {{amount}}",money_with_currency_format:"$ {{amount}} MXN"},MYR:{money_format:"RM{{amount}} MYR",money_with_currency_format:"RM{{amount}} MYR"},MUR:{money_format:"Rs {{amount}}",money_with_currency_format:"Rs {{amount}} MUR"},MDL:{money_format:"{{amount}} MDL",money_with_currency_format:"{{amount}} MDL"},MAD:{money_format:"{{amount}} dh",money_with_currency_format:"Dh {{amount}} MAD"},MNT:{money_format:"{{amount_no_decimals}} &#8366",money_with_currency_format:"{{amount_no_decimals}} MNT"},MZN:{money_format:"{{amount}} Mt",money_with_currency_format:"Mt {{amount}} MZN"},NAD:{money_format:"N${{amount}}",money_with_currency_format:"N${{amount}} NAD"},NPR:{money_format:"Rs{{amount}}",money_with_currency_format:"Rs{{amount}} NPR"},ANG:{money_format:"&fnof;{{amount}}",money_with_currency_format:"{{amount}} NA&fnof;"},NZD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} NZD"},NIO:{money_format:"C${{amount}}",money_with_currency_format:"C${{amount}} NIO"},NGN:{money_format:"&#8358;{{amount}}",money_with_currency_format:"&#8358;{{amount}} NGN"},NOK:{money_format:"kr {{amount_with_comma_separator}}",money_with_currency_format:"kr {{amount_with_comma_separator}} NOK"},OMR:{money_format:"{{amount_with_comma_separator}} OMR",money_with_currency_format:"{{amount_with_comma_separator}} OMR"},PKR:{money_format:"Rs.{{amount}}",money_with_currency_format:"Rs.{{amount}} PKR"},PGK:{money_format:"K {{amount}}",money_with_currency_format:"K {{amount}} PGK"},PYG:{money_format:"Gs. {{amount_no_decimals_with_comma_separator}}",money_with_currency_format:"Gs. {{amount_no_decimals_with_comma_separator}} PYG"},PEN:{money_format:"S/. {{amount}}",money_with_currency_format:"S/. {{amount}} PEN"},PHP:{money_format:"&#8369;{{amount}}",money_with_currency_format:"&#8369;{{amount}} PHP"},PLN:{money_format:"{{amount_with_comma_separator}} zl",money_with_currency_format:"{{amount_with_comma_separator}} zl PLN"},QAR:{money_format:"QAR {{amount_with_comma_separator}}",money_with_currency_format:"QAR {{amount_with_comma_separator}}"},RON:{money_format:"{{amount_with_comma_separator}} lei",money_with_currency_format:"{{amount_with_comma_separator}} lei RON"},RUB:{money_format:"&#1088;&#1091;&#1073;{{amount_with_comma_separator}}",money_with_currency_format:"&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB"},RWF:{money_format:"{{amount_no_decimals}} RF",money_with_currency_format:"{{amount_no_decimals}} RWF"},WST:{money_format:"WS$ {{amount}}",money_with_currency_format:"WS$ {{amount}} WST"},SAR:{money_format:"{{amount}} SR",money_with_currency_format:"{{amount}} SAR"},STD:{money_format:"Db {{amount}}",money_with_currency_format:"Db {{amount}} STD"},RSD:{money_format:"{{amount}} RSD",money_with_currency_format:"{{amount}} RSD"},SCR:{money_format:"Rs {{amount}}",money_with_currency_format:"Rs {{amount}} SCR"},SGD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} SGD"},SYP:{money_format:"S&pound;{{amount}}",money_with_currency_format:"S&pound;{{amount}} SYP"},ZAR:{money_format:"R {{amount}}",money_with_currency_format:"R {{amount}} ZAR"},KRW:{money_format:"&#8361;{{amount_no_decimals}}",money_with_currency_format:"&#8361;{{amount_no_decimals}} KRW"},LKR:{money_format:"Rs {{amount}}",money_with_currency_format:"Rs {{amount}} LKR"},SEK:{money_format:"{{amount_no_decimals}} kr",money_with_currency_format:"{{amount_no_decimals}} kr SEK"},CHF:{money_format:"SFr. {{amount}}",money_with_currency_format:"SFr. {{amount}} CHF"},TWD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} TWD"},THB:{money_format:"{{amount}} &#xe3f;",money_with_currency_format:"{{amount}} &#xe3f; THB"},TZS:{money_format:"{{amount}} TZS",money_with_currency_format:"{{amount}} TZS"},TTD:{money_format:"${{amount}}",money_with_currency_format:"${{amount}} TTD"},TND:{money_format:"{{amount}}",money_with_currency_format:"{{amount}} DT"},TRY:{money_format:"{{amount}}TL",money_with_currency_format:"{{amount}}TL"},UGX:{money_format:"Ush {{amount_no_decimals}}",money_with_currency_format:"Ush {{amount_no_decimals}} UGX"},UAH:{money_format:"₴{{amount}}",money_with_currency_format:"₴{{amount}} UAH"},AED:{money_format:"Dhs. {{amount}}",money_with_currency_format:"Dhs. {{amount}} AED"},UYU:{money_format:"${{amount_with_comma_separator}}",money_with_currency_format:"${{amount_with_comma_separator}} UYU"},VUV:{money_format:"${{amount}}",money_with_currency_format:"${{amount}}VT"},VEF:{money_format:"Bs. {{amount_with_comma_separator}}",money_with_currency_format:"Bs. {{amount_with_comma_separator}} VEF"},VND:{money_format:"{{amount_no_decimals_with_comma_separator}}&#8363;",money_with_currency_format:"{{amount_no_decimals_with_comma_separator}} VND"},XBT:{money_format:"{{amount_no_decimals}} BTC",money_with_currency_format:"{{amount_no_decimals}} BTC"},XOF:{money_format:"CFA{{amount}}",money_with_currency_format:"CFA{{amount}} XOF"},ZMW:{money_format:"K{{amount_no_decimals_with_comma_separator}}",money_with_currency_format:"ZMW{{amount_no_decimals_with_comma_separator}}"}}

Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var currency
  if (document.querySelector(".currency-picker")) {
    currency = document.querySelector(".currency-picker").options[document.querySelector(".currency-picker").selectedIndex].getAttribute("data-currency");
  } else {
    currency = theme.currency
  }
  var formatString = (format || moneyFormats[currency]?.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_with_apostrophe_separator":
        value = formatWithDelimiters(cents, 2, "'", ".");
        break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    var check
    if (event.target.nodeName == 'SPAN'){
        check = event.target.parentElement.name === 'plus'
      } else {
        check = event.target.name === 'plus'
      }
    check ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = form => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

/*
 * Shopify Common JS
 *
 */
if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector('details');
    const summaryElements = this.querySelectorAll('summary');
    this.addAccessibilityAttributes(summaryElements);

    if (navigator.platform === 'iPhone') document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);

    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
    this.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
    if(this.querySelectorAll('.mobile-facets-close.btn')) {
      this.querySelector('.mobile-facets-close.btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        document.body.classList.remove('overflow-hidden-mobile', 'add-zindex');
        const detailsElement = event.currentTarget.closest('details');
        detailsElement.removeAttribute('open');
      });
    }
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach(element => {
      element.setAttribute('role', 'button');
      element.setAttribute('aria-expanded', false);
      element.setAttribute('aria-controls', element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if(!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector('summary')) : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute('open');

    if (detailsElement === this.mainDetailsToggle) {
      if(isOpen) event.preventDefault();
      isOpen ? this.closeMenuDrawer(summaryElement) : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));

      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
      });
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });
    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add('overflow-hidden-mobile');
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove('menu-opening');
      this.mainDetailsToggle.querySelectorAll('details').forEach(details =>  {
        details.removeAttribute('open');
        details.classList.remove('menu-opening');
      });
      this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute('open') && !this.mainDetailsToggle.contains(document.activeElement)) this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    document.body.classList.remove('overflow-hidden-mobile', 'add-zindex');
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove('menu-opening');
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;
    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    }

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header = this.header || document.getElementById('shopify-section-header');

    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });

    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add('overflow-hidden-mobile', 'add-zindex');
  }
}

customElements.define('header-drawer', HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this)
    );
    this.addEventListener('click', (event) => {
      if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
    });
    this.addEventListener('keyup', () => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
  }

  show(opener) {
    this.openedBy = opener;
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    this.querySelector('.template-popup')?.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');
    button?.addEventListener('click', () => {
      document.querySelector(this.getAttribute('data-modal'))?.show(button);
    });

    const a = this.querySelector('a');
    a?.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector(this.getAttribute('data-modal'))?.show(a);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent() {
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      window.pauseAllMedia();
      this.appendChild(content.querySelector('video, model-viewer, iframe')).focus();
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

class CartDialog extends HTMLElement {
  constructor() {
    super();

    this.querySelector('.mfp-close').addEventListener(
      'click',
      this.hide.bind(this)
    );
    this.addEventListener('keyup', () => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    this.addEventListener('click', (event) => {
      if (event.target.nodeName === 'CART-DIALOG') this.hide();
    });
    this.querySelector('#close-cartopener').addEventListener('click', this.hide.bind(this));
    this.querySelector('.popup__column .form-message').addEventListener('click', this.hide.bind(this));
  }  

  async show(lineitem, opened, quantity, status) {
    if (status) {
      this.querySelectorAll('.popup__table-col').forEach((e) => {
        e.style.display= 'none';
      })
      this.querySelector('.gp-popup-addtocart .actions').classList.add('visibility-hidden')
      this.querySelector('.ajax_header .item-added-to-cart').innerHTML = lineitem.status + ' ' + lineitem.message;
      this.querySelector('.popup__table .form-message').style.display = 'block';
      this.querySelector('.popup__column .form-message__link').innerHTML = lineitem.description;
      this.setAttribute("open", "")
    } else {
      if (lineitem) {
        this.querySelector('.popup__table .form-message').style.display = 'none';
        this.querySelector('.gp-popup-addtocart .actions').classList.remove('visibility-hidden')
        this.querySelectorAll('.popup__table-col').forEach((e) => {
          e.style.display= 'block';
        })
        var subtotal = await this.getCart();
        var quantity = parseInt(quantity) || 1;
        var pName = lineitem.title;
        var pImage = lineitem.image;
        this.querySelector('.product-confirm-name').innerHTML = pName;
        if(lineitem.selling_plan_allocation) {
          this.querySelector('.selling-plan-name').style.display = 'block';
          this.querySelector('.selling-plan-name .value').innerHTML = lineitem.selling_plan_allocation.selling_plan.name;
        } else {
          this.querySelector('.selling-plan-name').style.display = 'none';
          this.querySelector('.selling-plan-name .value').innerHTML = '';
        }
        if(!pImage){
          this.querySelector('.popup__column--result').classList.add('popup-no-image');
          this.querySelector('.popup__column--media').style.display = 'none';
        }else{
          this.querySelector('.popup__column--result').classList.remove('popup-no-image');
          this.querySelector('.popup__column--media').style.display = 'block';
          this.querySelector('.popup__image-wrapper').innerHTML = '<img src="'+ pImage +'" />';
        }
        this.querySelector('.product-confirm-subtotal .price').innerHTML = subtotal;
        this.querySelector('.product-confirm-qty .value').innerHTML = quantity;
        var itemText = this.querySelector('.ajax_header .one-item-text').innerHTML;
        if (quantity > 1) {
          itemText = this.querySelector('.ajax_header .other-item-text').innerHTML;
        }
        this.querySelector('.ajax_header .item-added-to-cart').innerHTML = quantity + ' ' + itemText;
        this.setAttribute("open", "")
      }
    }
  }

  hide() {
    this.removeAttribute("open");
  }
  getCart() {
    var result = fetch(`${routes.cart_url }`)
      .then((response) => response.text())
      .then((text) => {
          var html  = new DOMParser().parseFromString(text, 'text/html');
          var subtotal = html.querySelector(".totals__subtotal-value .money")?.innerHTML
          var counter_number = html.querySelector(".action-cart .counter-number")?.innerHTML
          document.querySelectorAll(".action-cart .counter-number")?.forEach((number) => {
            number.innerHTML = counter_number
          })
          var counter_number_toolbar = html.querySelector(".toolbar-item .counter-number")?.innerHTML
          document.querySelectorAll(".toolbar-item .counter-number")?.forEach((number) => {
            number.innerHTML = counter_number_toolbar
          })
          return subtotal
      })
      .catch((e) => {
        console.error(e);
      });
    return result
  }
}

customElements.define("cart-dialog", CartDialog)

class CartOpener extends HTMLElement {
  constructor() {
    super();

    this.button = this.querySelector('a');
    this.cartNotification = document.querySelector('cart-notification');
    this.button?.addEventListener('click', (e) => {
      this.button?.classList.add('ajax-loader-btn');
      e.preventDefault();
      this.addCart();
    });
  }

  addCart() {
    this.vId = this.button.getAttribute("data-vid");
    this.cartNotification.setActiveElement(document.activeElement);
    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    const formData = new FormData();
    formData.append('id', this.vId);
    formData.append('quantity', 1);
    formData.append('sections', this.cartNotification.getSectionsToRender().map((section) => section.id));
    formData.append('sections_url', window.location.pathname);
    config.body = formData;
    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((lineitem) => {
        document.querySelector(this.getAttribute('data-modal'))?.show(lineitem, this.button, 1, lineitem.status);
        this.cartNotification.renderContents(lineitem);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.button?.classList.remove('ajax-loader-btn');
        this.button?.removeAttribute('disabled');
      });
  }
  hide() {
    this.removeAttribute('open');
  }
}
customElements.define('cart-opener', CartOpener);

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this)
    );
    document.querySelector('.header-cart').addEventListener('click', (event) => {
      if (event.target === document.querySelector('.header-cart')) this.hide();
    });
    
  }
  show(opener) {
    this.openedBy = opener;
    document.body.classList.add('overflow-hidden');
    document.querySelector('.header-cart').classList.add('active');
    this.setAttribute('open', '');
    var url = '/cart?&view=ajax';
    fetch(url)
    .then(response => response.text())
    .then((text) => {
      const parsedHTML = new DOMParser().parseFromString(text, 'text/html');
      var pHtml = "";
      pHtml += parsedHTML.querySelector('#MainContent')?.innerHTML;
      this.querySelector('.minicart-slideout-wrapper').innerHTML = pHtml;

    })
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    document.querySelector('.header-cart').classList.remove('active');
    this.removeAttribute('open');
  }
}
customElements.define('cart-drawer', CartDrawer);
class CartNote extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('change', debounce((event) => {
      const body = JSON.stringify({ note: event.target.value });
      fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body }});
    }, 300))
  }
}

customElements.define('cart-note', CartNote);
var form_msg = document.getElementsByClassName("form-message");
for (var i = 0;  i < form_msg.length; i++) {
  form_msg[i].addEventListener("click", function (e) {
    e.currentTarget.style.display = "none"
  })
}

class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
      button: this.querySelector('button'),
      panel: this.querySelector('ul'),
    };
    this.elements.button.addEventListener('click', this.openSelector.bind(this));
    this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

    this.querySelectorAll('a').forEach(item => item.addEventListener('click', this.onItemClick.bind(this)));
  }

  hidePanel() {
    this.elements.button.setAttribute('aria-expanded', 'false');
    this.elements.panel.setAttribute('hidden', true);
  }

  onContainerKeyUp(event) {
    if (event.code?.toUpperCase() !== 'ESCAPE') return;

    this.hidePanel();
    this.elements.button.focus();
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector('form');
    this.elements.input.value = event.currentTarget.dataset.value;
    if (form) form.submit();
  }

  openSelector() {
    this.elements.button.focus();
    this.elements.panel.toggleAttribute('hidden');
    this.elements.button.setAttribute('aria-expanded', (this.elements.button.getAttribute('aria-expanded') === 'false').toString());
  }

  closeSelector(event) {
    const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
    if (event.relatedTarget === null || shouldClose) {
      this.hidePanel();
    }
  }
}

customElements.define('localization-form', LocalizationForm);
class scrollToTop extends HTMLElement {
  constructor() {
    super();
    document.addEventListener("DOMContentLoaded", function (event) {
      if ($(window).scrollTop() > 20) {
        $('.scroll-to-top').removeClass('hidden');
      } else {
        $('.scroll-to-top').addClass('hidden');
      }
      $(window).scroll(function(){
        if ($(this).scrollTop() > 20) {
          $('.scroll-to-top').removeClass('hidden');
        } else {
          $('.scroll-to-top').addClass('hidden');
        }
      });

      $(document).on('click', '.scroll-to-top', function(){
        $('html, body').animate({scrollTop: '0px'}, 800);
        return false;
      });
    });
  }

}
customElements.define('scroll-to-top', scrollToTop);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('ul');
    this.sliderItems = this.querySelectorAll('li');
    this.pageCount = this.querySelector('.slider-counter--current');
    this.pageTotal = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');
    this.prevButtonAll = this.querySelectorAll('button[name="previous"]');
    this.nextButtonAll = this.querySelectorAll('button[name="next"]');
    this.slider.addEventListener('scroll', this.update.bind(this));
    this.buttonMiddle();

    this.dotActive = this.querySelector('button[name="dot"].active');
    
    this.dotButton = this.querySelectorAll('button[name="dot"]')
    this.dotButton?.forEach((dot) => {
      dot.addEventListener('click', this.onDotClick.bind(this));
    })
    if (!this.slider || !this.nextButton) return;
    const resizeObserver = new ResizeObserver(entries => {this.initPages();this.buttonMiddle();this.updateHeight()});
    resizeObserver.observe(this.slider);  

    this.slider.addEventListener('scroll', this.update.bind(this));

    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
    this.prevButtonAll?.forEach((prev) => {prev.addEventListener('click', this.onButtonClick.bind(this))});
    this.nextButtonAll?.forEach((next) => {next.addEventListener('click', this.onButtonClick.bind(this))});
  }

  buttonMiddle() {
    if (this.querySelector('.card-media') && (this.prevButton && this.nextButton)) {
      var img = this.querySelector('.card-media').clientHeight;
      var height = parseInt(img)/2 - this.prevButton.clientHeight/2;
      this.prevButton.style.top = height + 'px';
      this.nextButton.style.top = height + 'px';
    }
  }

  initPages() {
    if (!this.sliderItems.length === 0) return;
    this.slidesPerPage = Math.floor(this.slider.clientWidth / this.sliderItems[0].clientWidth);
    this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;
    if (this.prevButton) {
      if (this.currentPage === 1) {
        this.prevButton.setAttribute('disabled', true);
        this.prevButtonAll?.forEach((prev) => {prev.setAttribute('disabled', true)});
      } else {
        this.prevButton.removeAttribute('disabled');
        this.prevButtonAll?.forEach((prev) => {prev.removeAttribute('disabled')});
      }
    }
    if(this.nextButton) {
      if (this.currentPage === this.totalPages) {
        this.nextButton.setAttribute('disabled', true);
        this.nextButtonAll?.forEach((next) => {next.setAttribute('disabled', true)});
      } else {
        this.nextButton.removeAttribute('disabled');
        this.nextButtonAll?.forEach((next) => {next.removeAttribute('disabled')});
      }
    }
    
    this.pageCount.textContent = this.currentPage;
    this.pageTotal.textContent = this.totalPages;
    if(this.querySelector('.slider-dots')) {
      if(this.querySelector('.slider-dots').innerHTML == false) {
        var dotList = '';
        if(this.totalPages > 0) {
          for( var i =1 ; i <= this.totalPages ; i++) {
            if(i==1){ 
              var active = 'active';
            }
            var dotItem = '<button type="button" aria-label="Dots" name="dot" class="dotslide '+active+'" data-position="'+i+'"></button>'
            dotList += dotItem;
          }
        }
        this.querySelector('.slider-dots').innerHTML += dotList;
        this.dotActive = this.querySelector('button[name="dot"].active');
      
        this.dotButton = this.querySelectorAll('button[name="dot"]');
        this.dotButton.forEach((dot) => {
          dot.addEventListener('click', this.onDotClick.bind(this));
        })
      }
    }
    this.querySelectorAll('button[name="dot"]')?.forEach((dot) => {
      let dotPosition = dot.getAttribute("data-position");
      dot.classList.remove("active");
      if(dotPosition == this.currentPage) {
        dot.classList.add("active");
      }
    })
    this.sliderItems?.forEach((sliderActive) => {
      sliderActive.classList.remove("product__media-item--full", "active");
      if(this.dotActive) {
        this.dotActive.classList.remove("active");
        this.dotButton?.forEach((dot) => {
          if(dot.getAttribute("data-position") == this.currentPage) {
            dot.classList.add("active");
          }
        })
      }
      var slidePosition = sliderActive.getAttribute("data-position");
      if(slidePosition == this.currentPage) {
        sliderActive.classList.add("product__media-item--full", "active");
      }
    })
    if(this.querySelector('.slider-vertical .product__media-list')) {
      var height_large_media = this.querySelector('.slider-vertical .product__modal-opener').clientHeight;
      if (height_large_media == 0) {
        var height_large_media = this.querySelector('.slider-vertical .deferred-media').clientHeight;
      }
      this.querySelector('.slider-dots').style.height = height_large_media + 'px';
    }
  }

  updateHeight() {
    if (this.querySelector('.slideshow .slider')){
      if(this.querySelector('.slide-content-inner')) {
        this.querySelectorAll('.slide-content-inner').forEach((content) => {
          content.closest(".slide-item").style.minHeight = content.clientHeight + 'px';
        })
      }
    }
  }

  onButtonClick(event) {
    event.preventDefault();
    const slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + this.sliderItems[0].clientWidth : this.slider.scrollLeft - this.sliderItems[0].clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition
    });
    if(event.currentTarget.name === 'next') {
      this.currentPage = this.currentPage + 1;

    } else {
      this.currentPage = this.currentPage - 1;
    }
    if(this.dotActive) {
      this.dotActive.classList.remove("active");
      
      this.dotButton.forEach((dot) => {
        if(dot.getAttribute("data-position") == this.currentPage) {
          this.dotActive = dot;
        }
      })
    }
  }
  onDotClick(event) {
    event.preventDefault();
    let number = parseInt(event.currentTarget.getAttribute("data-position"));
    this.dotActive.classList.remove("active");
    this.dotButton?.forEach((dot) => {
      dot.classList.remove("active");
    })
    let currentPosition = parseInt(this.dotActive.getAttribute("data-position"));
    this.dotActive = event.currentTarget;
    event.currentTarget.classList.add("active");
    let slideScrollPosition = this.slider.scrollLeft + this.sliderItems[0].clientWidth * (number - currentPosition);
    this.slider.scrollTo({
      left: slideScrollPosition,
      behavior: 'smooth'
    });

  }
}

customElements.define('slider-component', SliderComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
    this.querySelectorAll(".option-item").forEach((option) => {
      option.addEventListener("click", this.onVariantChange.bind(this))
    })
  }

  onVariantChange(evt) {
    this.target = evt.target
    var select = this.target.closest(".selector-wrapper")
    select?.querySelectorAll('.option-item').forEach((option) => {
      option.classList.remove('selected')
    })

    
    if ( this.target.classList.contains("select__select")) {
      this.target.options[this.target.selectedIndex].classList.add('selected')
      // select.querySelector(".selected-value").innerHTML = this.target.options[this.target.selectedIndex].getAttribute("data-value")
    } else {
      this.target.closest(".option-item").classList.add('selected')
      // select.querySelector(".selected-value").innerHTML = this.target.closest(".option-item").getAttribute("data-value")
    }
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateSKU();
      this.updateAvailable();
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media?.id}"]`
    );
    if (!newMedia) return;

    if(newMedia.classList.contains('quickview-item')) {
      const parent = newMedia.parentElement;
      parent.prepend(newMedia);
      window.setTimeout(() => { parent.scroll(0, 0) });
    }

    if(document.querySelector(".product__media-wrapper .slider-dots")){
      const num = newMedia.getAttribute("data-position");
      const newDot = document.querySelector(`.slider-dot[data-position="${num}"]`);
      
      if(newMedia.classList.contains('quickview-item')) {
        const parentDot = newDot.parentElement;
        const parentDotList = parentDot.parentElement;
        parentDotList.prepend(parentDot);
      } else {
        newDot.click();
      }
    }
  }

  updateURL() {
    if (!this.currentVariant) return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }
  updateSKU() {
    if (!this.currentVariant) return;
    var variantSKU = document.querySelector('.variant-sku');
    if (variantSKU && this.currentVariant.sku) {
      if(variantSKU.closest('.label-detail-wrapper')) {
        
        variantSKU.closest('.label-detail-wrapper').style.display = 'block';
        
      }
      variantSKU.innerText = this.currentVariant.sku;
    } else {
      if (variantSKU) {
        if(variantSKU.closest('.label-detail-wrapper')) {
          variantSKU.closest('.label-detail-wrapper').style.display = 'none';
        }
      }
    }
  }
  updateAvailable() {
    if (!this.currentVariant) return;
    var available = document.querySelector('.product-available');
    if (available) {
      if (this.currentVariant.available) {
        available.innerText = theme.in_stock;
      }else{
        available.innerText = theme.out_stock;
      }
    }
  }
  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', true);
      if (text) addButton.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButton.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');

    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
    document.getElementById(`price-${this.dataset.section}`)?.classList.add('visibility-hidden');
    var meta_id = `meta-${this.dataset.section}`;
    var meta_destination = document.getElementById(meta_id);
    var available = meta_destination.querySelector(".label-detail-wrapper span[data-available]");
    available.innerHTML = window.variantStrings.unavailable;
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const current_fieldset = Array.from(this.querySelectorAll('.selector-wrapper'));
    this.options = current_fieldset.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('.option-item'))?.find((radio) => radio.classList.contains('selected')).getAttribute("data-value");
    });
    var all_fieldsets = Array.from(document.querySelectorAll('.selector-wrapper'));
    var other_fieldset = all_fieldsets.filter(x => !current_fieldset.includes(x))
    other_fieldset.map((fieldset) => {
      Array.from(fieldset.querySelectorAll('.option-item')).find((radio) => {
        if (this.options.includes(radio.getAttribute('data-value'))) {
          if (!radio.classList.contains("selected")) {
            radio.classList.add('selected')
            // Trigger change for sticky/main input
            var event = new Event('click');
            radio.dispatchEvent(event)
          }
        } else {
          radio.classList.remove('selected')
        }
      });
    });
  }
}

customElements.define('variant-radios', VariantRadios);
