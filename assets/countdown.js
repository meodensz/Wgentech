if (!customElements.get('gp-countdown')) {
  customElements.define('gp-countdown',class Countdown extends HTMLElement {
  constructor() {
    super();

    this.countdown = this.querySelector(".countdown");
    var year = parseInt(this.countdown.getAttribute('data-year'));
    var month = parseInt(this.countdown.getAttribute('data-month') - 1);
    var day = parseInt(this.countdown.getAttribute('data-day'));
    this.newDate = new Date(year, month, day).getTime();


      var x = setInterval(this.initCountdown.bind(this), 1000);
  }

  initCountdown(countDownDate) {
        // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = this.newDate - now;
      
      if (distance < 0) {
        this.style.display = "none"
        return;
      }
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in an element with id="demo"
      this.querySelector(".countdown-days").innerHTML = days;
      this.querySelector(".countdown-hours").innerHTML = hours;
      this.querySelector(".countdown-minutes").innerHTML = minutes; 
      this.querySelector(".countdown-seconds").innerHTML = seconds; 

      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        this.style.display = "none"
      }
  }

});
}