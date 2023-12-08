import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { count, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public myForm: FormGroup = this.formBuilder.group({
    region:['',[Validators.required]],
    country:['',[Validators.required]],
    border:['',[Validators.required]],
  })

  public countriesByregion: SmallCountry[] = []
  public borders: SmallCountry[] = []

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService
  ){}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions():Region[]{
    return this.countryService.regions;
  }

  onRegionChange(){
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')?.setValue('')),
        tap(() => this.myForm.get('border')?.setValue('')),
        tap(() => this.borders = []),
        switchMap(region => this.countryService.getCountriesByRegion(region))
      )
      .subscribe( value => {
        this.countriesByregion = value
      })
  }

  onCountryChange(){
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')?.setValue('')),
        //tap((value) => console.log(value)),
        //si el país esta vacio no se hace la petición http
        filter((value:string) => value.length > 0),
        //si
        switchMap(alphaCode => this.countryService.getCountryByAlphaCode(alphaCode)),
        //tap((value) => console.log(value)),
        switchMap(country => this.countryService.getCountryBordersBycodes(country.borders)),
        //tap((value) => console.log(value)),
      )
      .subscribe( countries => {
        this.borders = countries
      })
  }

  getCountriesByRegion(region: Region): SmallCountry[]{

    return []
  }

}
