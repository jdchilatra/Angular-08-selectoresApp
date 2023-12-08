import { Injectable } from '@angular/core';
import { Region, SmallCountry, Maps, Country } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


  private baseUrl: string = "https://restcountries.com/v3.1";

  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania,
  ]

  get regions():Region[]{
    //con el spread no se pasa por referencia
    return [...this._regions]
  }

  constructor(
    private http: HttpClient
  ) { }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]>{

    if(!region) return of([])

    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
      .pipe(
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })) as SmallCountry[]),
        //tap(reesponse => console.log(reesponse))
      );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry>{
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
      .pipe(
        map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }) as SmallCountry)
      )

  }

  getCountryBordersBycodes(bordes: string[]): Observable<SmallCountry[]>{

    if(!bordes || bordes.length === 0) return of([]);

    const countryRequest: Observable<SmallCountry>[] = []
    bordes.forEach(code => {
      const request = this.getCountryByAlphaCode(code);
      countryRequest.push(request);
    })

    return combineLatest(countryRequest)

  }


}
