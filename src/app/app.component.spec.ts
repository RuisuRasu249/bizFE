import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavComponent } from './components/nav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './services/authService.component';
import { DataService } from './data.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AppComponent, // Include AppComponent in imports for standalone components
        NavComponent, // Include standalone NavComponent
      ],
      providers: [AuthService, DataService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    dataService = TestBed.inject(DataService);

    spyOn(authService, 'checkAuthentication');
    spyOn(dataService, 'populateReviews');

    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'AlbumsFE'`, () => {
    expect(component.title).toEqual('AlbumsFE');
  });

  it('should call checkAuthentication from AuthService on init', () => {
    component.ngOnInit();
    expect(authService.checkAuthentication).toHaveBeenCalled();
  });

  it('should render navigation bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('navigation')).toBeTruthy();
  });

  it('should render router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
