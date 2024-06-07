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
      sliderActive.classList.remove("active");
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
        sliderActive.classList.add("active");
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
