import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingFormComponent } from './listingForm.component';

describe('ListingFormComponent', () => {
  let component: ListingFormComponent;
  let fixture: ComponentFixture<ListingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListingFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
