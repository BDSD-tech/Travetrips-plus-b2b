import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-filter',
  template: `
  <div class="al-listbtm filter-loading">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Price</span>
              <a href="javascript:void(0);">
                  <span class="ast-recolor"><span>RESET</span></span>
              </a>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm filter-loading">
      <div class="form-check">
          <label class="form-check-label" for="reverseCheck1">
              Show Incv
          </label>
      </div>
      <div class="form-check">
          <label class="form-check-label" for="reverseCheck2">
              Show Net
          </label>
      </div>
  </div>
  <div class="al-listbtm filter-loading">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Stops</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm filter-loading">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Departure Time</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm filter-loading">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Arrival Time</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm filter-loading">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Airlines</span>
              <a href="#">
                  <span class="ast-recolor"><span>Clear</span></span>
              </a>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>`,
})
export class LoadingFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
