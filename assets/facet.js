class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
    this.querySelector('#toggle-filter')?.addEventListener('click', () => {
      document.querySelector('#toggle-filter').classList.toggle('active');
      document.querySelector('.collection-filter__wrapper').classList.toggle('active');
      document.querySelector('.collection').classList.toggle('active');
    });
    if(document.querySelector(".collection-filters__viewmode .icon-grid")){
      document.querySelector(".collection-filters__viewmode .icon-grid").addEventListener('click', () => {
        document.querySelector(".collection-filters__viewmode .icon-grid").classList.add("active");
        document.querySelector(".collection-filters__viewmode .icon-list").classList.remove("active");
        document.querySelector(".main-collection-product-grid").classList.remove("view-list");
        document.querySelectorAll(".card-wrapper").forEach((item) => {
          item.classList.add("product-grid");
          item.classList.remove("product-list");
        })
      })
    }
    if(document.querySelector(".collection-filters__viewmode .icon-list")){
      document.querySelector(".collection-filters__viewmode .icon-list").addEventListener('click', () => {
        document.querySelector(".collection-filters__viewmode .icon-grid").classList.remove("active");
        document.querySelector(".collection-filters__viewmode .icon-list").classList.add("active");
        document.querySelector(".main-collection-product-grid").classList.add("view-list");
        document.querySelectorAll(".card-wrapper").forEach((item) => {
          item.classList.add("product-list");
          item.classList.remove("product-grid");
        })
      })
    }
    if(document.querySelectorAll('.active-facets .active-facets-list .active-facets__button').length > 0) {
      document.querySelectorAll('.active-facets').forEach((show) => {
        show.style.display = 'flex';
      })
    } else {
      document.querySelectorAll('.active-facets').forEach((hide) => {
        hide.style.display = 'none';
      })
    }
    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    }
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
    document.body.classList.remove('overflow-hidden-mobile');

    if(document.querySelectorAll('.active-facets .active-facets-list .active-facets__button').length > 0) {
      document.querySelectorAll('.active-facets').forEach((show) => {
        show.style.display = 'flex';
      })
    } else {
      document.querySelectorAll('.active-facets').forEach((hide) => {
        hide.style.display = 'none';
      })
    }
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    document.getElementById('ProductGridContainer').querySelector('.collection')?.classList.add('loading');

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl) ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGridContainer(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
    document.querySelector('.collection').classList.remove('loading');
  }

  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount')?.innerHTML
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter');
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    }
    
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });
    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    })

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      }
    ]
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.inputs = this.querySelectorAll('input');
    this.querySelectorAll('.min').forEach((min => {min.innerHTML = this.inputs[0].value;}));
    this.querySelectorAll('.max').forEach((max => {max.innerHTML = this.inputs[1].value;}));
    this.querySelectorAll('input')
      .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
    this.querySelectorAll('.min').forEach((min => {min.innerHTML = this.inputs[0].value;}));
    this.querySelectorAll('.max').forEach((max => {max.innerHTML = this.inputs[1].value;}));
  }

  setMinAndMaxValues() {
    var minInput = this.inputs[0].value;
    var maxInput = this.inputs[1].value;
    var max = Number(this.inputs[1].getAttribute('max'));
    var minWidth = minInput / max * 100;
    var width = maxInput / max * 100;
    var widthMinIput = 'calc(' + width + '% + ' + (100 - width)*10/100 + 'px)';
    this.inputs[0].setAttribute('max', maxInput);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    this.inputs[0].style.width = widthMinIput;
    if(this.querySelector('.blackline')) {
      var widthline = 'calc(' + (width - minInput / max * 100) + '% - ' + (20 - 20*(100 - (width - minWidth))/100) + 'px)';
      this.querySelector('.blackline').style.width = widthline;
      this.querySelector('.blackline').style.left = 'calc(' +  minInput / max * 100 + '% + ' + (10 - 10*(100 - (width - minWidth))/100) + 'px)';
    }
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));
    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
      form.onActiveFilterClick(event);
    });
  }
}

customElements.define('facet-remove', FacetRemove);