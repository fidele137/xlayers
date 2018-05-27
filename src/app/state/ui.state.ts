import { State, Action, StateContext, Selector } from '@ngxs/store';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { merge } from 'rxjs';
import { tap, map, takeUntil, mergeMap } from 'rxjs/operators';

export type SketchMSLayer = SketchMSPage | SketchMSSymbolMaster;

export interface UiSettings {
  currentPage?: SketchMSLayer;
  currentLayer?: SketchMSSymbolMaster;
  availablePages?: Array<SketchMSPage>;
  wireframe?: boolean;
  preview?: boolean;
  settingsEnabled?: boolean;
}

export class ShowWireframe {
  static readonly type = '[UiSettings] Show Wireframe';
}

export class HideWireframe {
  static readonly type = '[UiSettings] Hide Wireframe';
}
export class ShowPreview {
  static readonly type = '[UiSettings] Show Preview';
}

export class HidePreview {
  static readonly type = '[UiSettings] Hide Preview';
}
export class AvailablePages {
  static readonly type = '[UiSettings] Available Pages';
  constructor(public pages: SketchMSPage[]) {}
}

export class CurrentPage {
  static readonly type = '[UiSettings] Current Page';
  constructor(public page: SketchMSPage) {}
}

export class CurrentLayer {
  static readonly type = '[UiSettings] Current Layer';
  constructor(public layer: SketchMSSymbolMaster) {}
}

export class SettingsEnabled {
  static readonly type = '[UiSettings] Enable Settings';
}
export class AutoFixCurrentPagePosition {
  static readonly type = '[UiSettings] Auto Fix Current Page Position';
  constructor(public page: SketchMSLayer) {}
}

@State<UiSettings>({
  name: 'ui',
  defaults: {
    wireframe: true,
    preview: true,
    availablePages: []
  }
})
export class UiState {
  constructor(private snackBar: MatSnackBar) {}

  @Selector()
  static isWireframe(ui: UiSettings) {
    return ui.wireframe;
  }

  @Selector()
  static isPreview(ui: UiSettings) {
    return ui.preview;
  }

  @Selector()
  static currentPage(ui: UiSettings) {
    return ui.currentPage;
  }

  @Selector()
  static autoFixCurrentPagePosition(ui: UiSettings) {
    return ui.currentPage;
  }

  @Selector()
  static currentLayer(ui: UiSettings) {
    return ui.currentLayer;
  }

  @Selector()
  static availablePages(ui: UiSettings) {
    return ui.availablePages;
  }

  @Selector()
  static isSettingsEnabled(ui: UiSettings) {
    return ui.settingsEnabled;
  }

  @Action(ShowPreview)
  showPreview({ getState, patchState }: StateContext<UiSettings>) {
    patchState({
      preview: true
    });
  }

  @Action(HidePreview)
  hidePreview({ getState, patchState }: StateContext<UiSettings>) {
    patchState({
      preview: false
    });
  }

  @Action(ShowWireframe)
  showWireframe({ getState, patchState }: StateContext<UiSettings>) {
    patchState({
      wireframe: true
    });
  }

  @Action(HideWireframe)
  hideWireframe({ getState, patchState }: StateContext<UiSettings>) {
    patchState({
      wireframe: false
    });
  }

  @Action(AvailablePages)
  setAvailablePages({ getState, patchState }: StateContext<UiSettings>, action: AvailablePages) {
    patchState({
      availablePages: action.pages
    });
  }

  @Action(CurrentPage)
  currentPage({ getState, patchState }: StateContext<UiSettings>, action: CurrentPage) {
    patchState({
      currentPage: action.page
    });
  }

  @Action(CurrentLayer)
  currentLayer({ getState, patchState }: StateContext<UiSettings>, action: CurrentLayer) {
    patchState({
      currentLayer: action.layer
    });
  }

  @Action(SettingsEnabled)
  enableSettings({ getState, patchState }: StateContext<UiSettings>, action: SettingsEnabled) {
    patchState({
      settingsEnabled: true
    });
  }

  @Action(AutoFixCurrentPagePosition)
  autoFixLayersPosition({ getState, patchState, dispatch }: StateContext<UiSettings>, action: AutoFixCurrentPagePosition) {
    const currentPage = {...action.page};

    // reset the top/left position of the current page
    // and the root layers
    currentPage.frame.x = 0;
    currentPage.frame.y = 0;

    patchState({
      currentPage
    });

    this.snackBar
      .open('Fixed Layers Positions', 'Undo', {
        duration: 3000
      })
      .onAction()
      .subscribe(() => {
        console.log('todo: The UNDO action was triggered!');
      });
  }
}
