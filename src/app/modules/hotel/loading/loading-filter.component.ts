import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-filter',
  template: `
  <div class="al-listbtm">
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
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Hotel Name</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Hotel Facility</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Hotel Address List</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Star Rating</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Hotel Meal Type</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Fare Type</span>
              <i class="fa fa-plus float-end filter-minus"></i>
          </p>
      </div>
  </div>
  <div class="al-listbtm">
      <div class="al-priceac">
          <p class="al-prresets">
              <span>Locations</span>
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
