
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-carousel', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-wrap',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()

////////////////////////////////////////
function getInputs() {
  var numProcesses = document.getElementById('numProcesses').value
  var inputTableBody = document.getElementById('inputTableBody')
  var inputForm = document.getElementById('inputForm')

  if (!isEmpty(numProcesses)) {
      //clear table of inputs
      inputTableBody.innerHTML = ""

      //display input form
      inputForm.style.display = 'block'

      //iterate through every process
      for (var i = 1; i <= numProcesses; i++) {
          var row = "<tr><td>Process " + i + "</td>" +
                "<td><input type='number' id='arrivalTime" + i + "'></td>" +
                "<td><input type='number' id='burstTime" + i + "'></td></tr>"

          inputTableBody.innerHTML += row
      }
  }
  else {
      alert("Please input number of processes.")
      return
  }
}

function clearInputs() {
  //clear input form
  document.getElementById('inputForm').style.display = 'none';

  //clear number of processes input
  document.getElementById('numProcesses').value = '';

  //clear input table body
  document.getElementById('inputTableBody').innerHTML = '';

  //clear output section
  document.getElementById('output-section').style.display = 'none';
}

////////////////////////////////////////
function generateRequestInputs() {
    var numRequests = document.getElementById("numRequests").value;
    var requestInputsContainer = document.getElementById("requestInputs");

    // Clear previous inputs
    requestInputsContainer.innerHTML = "";

    // Create the table
    var table = document.createElement("table");

    // Create the table header
    var headerRow = table.createTHead().insertRow(0);
    var locationHeader = headerRow.insertCell(0);
    locationHeader.innerHTML = "Location #1-" + numRequests;

    var requestHeader = headerRow.insertCell(1);
    requestHeader.innerHTML = "Request Location";

    // Create the table body
    var tableBody = table.createTBody();

    for (var i = 1; i <= numRequests; i++) {
      var row = tableBody.insertRow();
      var locationCell = row.insertCell(0);
      locationCell.innerHTML = "Location #" + i;

      var requestCell = row.insertCell(1);
      var input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.placeholder = "Enter request location";
      requestCell.appendChild(input);
    }

    // Append the table to the container
    requestInputsContainer.appendChild(table);
  }

function calculateCircularScan() {

  //create table heading for output table
  var outputTable = document.getElementById('outputTable')
  

  const currentPosition = parseInt(document.getElementById('currentPosition').value);
  const trackSize = parseInt(document.getElementById('trackSize').value);
  const numRequests = parseInt(document.getElementById('numRequests').value);

  const requests = [];
  for (let i = 1; i <= numRequests; i++) {
      const request = parseInt(document.getElementById(`request${i}`).value);
      requests.push(request);
  }

  // Circular-Scan algorithm implementation
  requests.push(0);
  requests.push(trackSize - 1);
  requests.sort((a, b) => a - b);

  let head = currentPosition;
  let rightArray = requests.filter(val => val > head).sort((a, b) => a - b);
  let leftArray = requests.filter(val => val < head).sort((a, b) => a - b);

  let seekSequence = [];
  let seekTime = 0;

  // Move head from current position to the end (tracksize - 1)
  for (let i = 0; i < rightArray.length; i++) {
      seekSequence.push(head);
      seekTime += Math.abs(rightArray[i] - head);
      head = rightArray[i];
  }

  seekTime += trackSize - 1;
  let lefthead = head;
  let finalseekTime = seekTime;
  

  // Move head from the beginning to the end of the left array
  for (let i = 0; i <= leftArray.length; i++) {
      seekSequence.push(lefthead);
      lefthead = leftArray[i];
  }
  finalseekTime += leftArray[leftArray.length - 1];

  document.getElementById('totalHeadMovement').textContent = seekSequence.length - 1; // Total head movement is the length of seekSequence minus 1
  document.getElementById('seekTime').textContent = finalseekTime;
  document.getElementById('seekSequence').textContent = seekSequence.join(' -> ');

  
}

function resetInputs() {
  document.getElementById('currentPosition').value = '';
  document.getElementById('trackSize').value = '';
  document.getElementById('numRequests').value = '';
  document.getElementById('requestInputs').innerHTML = '';
  document.getElementById('totalHeadMovement').textContent = '';
  document.getElementById('seekTime').textContent = '';
  document.getElementById('seekSequence').textContent = '';
}


(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-carousel', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-wrap',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()

////////////////////////////////////////
function getInputs() {
  var numProcesses = document.getElementById('numProcesses').value
  var inputTableBody = document.getElementById('inputTableBody')
  var inputForm = document.getElementById('inputForm')

  if (!isEmpty(numProcesses)) {
      //clear table of inputs
      inputTableBody.innerHTML = ""

      //display input form
      inputForm.style.display = 'block'

      //iterate through every process
      for (var i = 1; i <= numProcesses; i++) {
          var row = "<tr><td>Process " + i + "</td>" +
                "<td><input type='number' id='arrivalTime" + i + "'></td>" +
                "<td><input type='number' id='burstTime" + i + "'></td></tr>"

          inputTableBody.innerHTML += row
      }
  }
  else {
      alert("Please input number of processes.")
      return
  }
}

function calculateSRTF() {
  //obtain process details
  var numProcesses = document.getElementById('numProcesses').value

  var arrivalTime = []
  var burstTime = []
  var remainingTime = []

  //iterate through every instance of arrival time, burst time, and remaining time to get values
  for (var i = 1; i <= numProcesses; i++) {
      //check if arrival and burst times are empty
      if (isEmpty(document.getElementById('arrivalTime' + i).value) || isEmpty(document.getElementById('burstTime' + i).value)) {
          alert("Please fill in all Arrival Time and Burst Time fields.");
          return
      }

      //check if input is valid

      if (isNaN(parseInt(document.getElementById('arrivalTime' + i).value)) || isNaN(parseInt(document.getElementById('burstTime' + i).value))) {
          
          return;
      }

      arrivalTime.push(parseInt(document.getElementById('arrivalTime' + i).value))
      burstTime.push(parseInt(document.getElementById('burstTime' + i).value))
      remainingTime.push(parseInt(document.getElementById('burstTime' + i).value))
  }

  //instantiate current time, number of completed processes, and total time for waiting and turnaround
  var currentTime = 0
  var completedProcesses = 0
  var totalWaitingTime = 0
  var totalTurnaroundTime = 0

  //create table heading for output table
  var outputTable = document.getElementById('outputTable')
  outputTable.innerHTML = "<thead><tr><th>Process</th><th>Waiting Time</th><th>Turnaround Time</th></tr></thead><tbody>"

  //continue until all processes have been completed
  while (completedProcesses < numProcesses) {
      var shortest = -1
      var minTime = Number.MAX_VALUE

      //find process with shortest remaining time
      for (var j = 0; j < numProcesses; j++) {
          if (arrivalTime[j] <= currentTime && remainingTime[j] < minTime && remainingTime[j] > 0) {
              minTime = remainingTime[j]
              shortest = j
          }
      }

      //check if a process is found
      if (shortest === -1) {
          currentTime++
      } 
      else {
          //decrement remaining time and increment current time
          remainingTime[shortest]--
          currentTime++


          //if processes complete its execution, calculate waiting and turnaround time 
          if (remainingTime[shortest] === 0) {
              completedProcesses++
              var turnaroundTime = currentTime - arrivalTime[shortest]
              var waitingTime = turnaroundTime - burstTime[shortest]

              //total turnaround and waiting time
              totalWaitingTime += waitingTime
              totalTurnaroundTime += turnaroundTime

              //show result of completed processes
              outputTable.innerHTML += "<tr><td>Process " + (shortest + 1) + "</td><td>" + waitingTime + "</td><td>" + turnaroundTime + "</td></tr>"
          }
      }
  }
  outputTable.innerHTML += "</tbody></table>"

  //calculate average waiting and turnaround time
  var avgWaitingTime = totalWaitingTime / numProcesses
  var avgTurnaroundTime = totalTurnaroundTime / numProcesses

  //display average
  outputTable.innerHTML += "<tr><td>Average:</td><td>" + avgWaitingTime + "</td><td>" + avgTurnaroundTime + "</td></tr>"

  //display output section
  document.getElementById('output-section').style.display = 'block'
}

function isEmpty(value) {
  return value === undefined || value === null || value === ''
}





////////////////////////////////////////
function generateRequestInputs() {
  const numRequests = document.getElementById('numRequests').value;
  const requestInputsDiv = document.getElementById('requestInputs');
  requestInputsDiv.innerHTML = ''; // Clear previous inputs

  // Create the table
  const table = document.createElement('table');
  table.classList.add('request-table');

  // Create the table header
  const headerRow = table.insertRow();
  const locationHeader = document.createElement('th');
  locationHeader.textContent = 'Location No.';
  headerRow.appendChild(locationHeader);

  const requestHeader = document.createElement('th');
  requestHeader.textContent = 'Request Location';
  headerRow.appendChild(requestHeader);

  // Create the table body
  for (let i = 1; i <= numRequests; i++) {
    const row = table.insertRow();
    const locationCell = row.insertCell();
    locationCell.textContent = `Location #${i}`;

    const requestCell = row.insertCell();
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.id = `request${i}`;
    requestCell.appendChild(input);
  }

  // Append the table to the container
  requestInputsDiv.appendChild(table);
}

// CSCAN function
function calculateCircularScan() {

  //create table heading for output table
  var outputTable = document.getElementById('outputTable')
  
  // getting inputs from input texts
  const currentPosition = parseInt(document.getElementById('currentPosition').value);
  const trackSize = parseInt(document.getElementById('trackSize').value);
  const numRequests = parseInt(document.getElementById('numRequests').value);

  const requests = []; // push all request location
  for (let i = 1; i <= numRequests; i++) {
      const request = parseInt(document.getElementById(`request${i}`).value);
      requests.push(request);
  }
  
  // Circular-Scan algorithm implementation
  requests.push(0); // push 0 in the array (start of the array)
  requests.push(trackSize - 1); // push tracksize -1 (end of the array)
  requests.sort((a, b) => a - b); // sort the array

  let head = currentPosition; 
  // dividing array into two using head and sorting them in ascending order
  let rightArray = requests.filter(val => val > head).sort((a, b) => a - b); 
  let leftArray = requests.filter(val => val < head).sort((a, b) => a - b); 

  let seekSequence = []; 
  let seekTime = 0;

  //START SEEK SEQUENCE
  // Move head from current position to the end (tracksize - 1)
  for (let i = 0; i < rightArray.length; i++) {
      seekSequence.push(head); // pushing the head to the seeksequence array
      seekTime += Math.abs(rightArray[i] - head); // adding the distance from the current index to the last head to the seek time
      head = rightArray[i]; // changing the head to the current location
  }

  seekTime += trackSize - 1; // add the distance from end of disk and 0 which is the start of the disk
  let lefthead = head;
  let finalseekTime = seekTime;
  

  // Move head from the beginning to the end of the left array
  for (let i = 0; i <= leftArray.length; i++) {
      seekSequence.push(lefthead); // push the head to the seeksequence array
      lefthead = leftArray[i]; // changing the head to the current location
  }
  // adding the values of seek time from left array
  // easier approach since the values starts from 0
  finalseekTime += leftArray[leftArray.length - 1];
  // displaying results
  document.getElementById('totalHeadMovement').textContent = seekSequence.length - 1; // Total head movement is the length of seekSequence minus 1
  document.getElementById('seekTime').textContent = finalseekTime;
  document.getElementById('seekSequence').textContent = seekSequence.join(' -> ');

  
}
// function to reset inputs when the input again button is clicked
function resetInputs() {
  document.getElementById('currentPosition').value = '';
  document.getElementById('trackSize').value = '';
  document.getElementById('numRequests').value = '';
  document.getElementById('requestInputs').innerHTML = '';
  document.getElementById('totalHeadMovement').textContent = '';
  document.getElementById('seekTime').textContent = '';
  document.getElementById('seekSequence').textContent = '';
}

////////////////////////////////////////
function calculateFCFS() {
  // Obtain process details
  var numProcesses = document.getElementById('numProcesses').value;

  var processes = [];

  // Validate input fields
  for (var i = 1; i <= numProcesses; i++) {
      var arrivalInput = document.getElementById('arrivalTime' + i);
      var burstInput = document.getElementById('burstTime' + i);

      if (isEmpty(arrivalInput.value) || isEmpty(burstInput.value)) {
          alert("Please fill in all Arrival Time and Burst Time fields.");
          return;
      }

      processes.push({
        arrivalTime: parseInt(arrivalInput.value),
        burstTime: parseInt(burstInput.value),
        processId: i
      });
  }

  // Sort the processes by arrival time
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Instantiate current time, completion time, turnaround time, and waiting time
  var currentTime = 0;
  var completionTime = [];
  var turnaroundTime = [];
  var waitingTime = [];

  // Create table heading for output table without Completion Time
  var outputTable = document.getElementById('outputTable');
  outputTable.innerHTML = "<thead><tr><th>Process</th><th>Turnaround Time</th><th>Waiting Time</th></tr></thead><tbody>";

  // Iterate through processes
  for (var i = 0; i < numProcesses; i++) {
      if(currentTime < processes[i].arrivalTime) {
          currentTime = processes[i].arrivalTime;
      }
      completionTime[i] = currentTime + processes[i].burstTime;
      turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
      waitingTime[i] = turnaroundTime[i] - processes[i].burstTime;

      // Show result of completed processes without Completion Time
      outputTable.innerHTML += "<tr><td>Process " + processes[i].processId + "</td><td>" + turnaroundTime[i] + "</td><td>" + waitingTime[i] + "</td></tr>";

      currentTime = completionTime[i];
  }

  outputTable.innerHTML += "</tbody></table>";

  // Calculate average waiting and turnaround time
  var avgWaitingTime = waitingTime.reduce((a, b) => a + b, 0) / numProcesses;
  var avgTurnaroundTime = turnaroundTime.reduce((a, b) => a + b, 0) / numProcesses;

  // Display average without trailing zeros
  outputTable.innerHTML += "<tr><td>Average:</td><td>" + avgTurnaroundTime.toFixed(2).replace(/\.?0+$/, '') + "</td><td>" + avgWaitingTime.toFixed(2).replace(/\.?0+$/, '') + "</td></tr>";

  // Display output section
  document.getElementById('output-section').style.display = 'block';
}