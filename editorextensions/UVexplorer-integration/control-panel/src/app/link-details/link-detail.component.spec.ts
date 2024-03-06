import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockDeviceLinkEdge } from 'mock_data/devices';
import { LinkDetailComponent } from './link-detail.component';
import { By } from '@angular/platform-browser';

describe('LinkDetailComponent', () => {
    let component: LinkDetailComponent;
    let fixture: ComponentFixture<LinkDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LinkDetailComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LinkDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should correctly display a point value', () => {
        const point = { x: 12, y: 25 };
        const displayedPoint = component.displayValue(point);
        const expected = 'x: 12, y: 25';

        expect(displayedPoint).toEqual(expected);
    });

    it('should correctly display a string array', () => {
        const arr = ['one', 'two', 'three'];
        const displayedArr = component.displayValue(arr);
        const expected = arr.toString();

        expect(displayedArr).toEqual(expected);
    });

    it('should correctly display a number', () => {
        const num = 876;
        const displayedNum = component.displayValue(num);
        const expected = '876';

        expect(displayedNum).toEqual(expected);
    });

    it('should display loading before link details info is set', () => {
        const compDebug = fixture.debugElement;
        const loadingElem = compDebug.query(By.css('.loading'));

        expect(loadingElem).toBeTruthy();
    });

    it('should not display loading after link details info is set', () => {
        component.deviceLink = mockDeviceLinkEdge;
        fixture.detectChanges();
        const compDebug = fixture.debugElement;
        const loadingElem = compDebug.query(By.css('.loading'));

        expect(loadingElem).toBeNull();

        component.deviceLink = undefined;
    });
});
