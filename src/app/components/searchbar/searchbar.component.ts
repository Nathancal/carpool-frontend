import { Component, OnInit, Output } from '@angular/core';
import {services as ttServices} from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {


  searchInput!: string;
  results: any;
  positionOfResult: any;

  constructor() { }

  opt = {
    minNumberOfCharacters: 2,
    searchOptions: {
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      language: 'en-GB',
      countrySet: 'GB',
      resultSet:'category,brand'
    },
    autocompleteOptions: {
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      language: 'en-GB',
      countrySet: 'GB',
      resultSet:'category,brand'
    }
  }


  tomSearch = new SearchBox(ttServices, this.opt);

  ngOnInit(): void {
    this.tomSearch.on('tomtom.searchbox.resultselected', (res: any)=>{
      this.positionOfResult = res.data.result.position;


    });
    this.tomSearch.on('tomtom.searchbox.resultsfound', (res: any)=>{

      this.results = res.data.results.fuzzySearch.results;

      if (this.results.length < 2){
        this.positionOfResult = this.results[0].position;
        console.log(this.positionOfResult);
      }
    });

  }

  autoCompleteSearch(event: any){
    this.searchInput = event;
    this.tomSearch.setValue(event);
    this.tomSearch.query();
  }

}
