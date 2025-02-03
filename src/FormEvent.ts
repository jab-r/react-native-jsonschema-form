interface FormEventParams<T = any> {
  name?: string;
  value?: T;
  values?: Record<string, any>;
  metas?: Record<string, any>;
  nextMeta?: any;
  nextErrors?: any;
  silent?: boolean;
  path?: string | number | Array<string | number>;
  update?: string[];
  response?: any;
  errors?: Record<string, any>;
  exceptions?: Record<string, any>;
}

class FormEvent<T = any> {
  public type: string;

  public params: FormEventParams<T>;

  private defaultPrevented: boolean;

  constructor(type: string, params: FormEventParams<T> = {}) {
    this.type = type;
    this.params = {
      ...params,
      update: params.update || [],
    };
    this.defaultPrevented = false;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  isDefaultPrevented(): boolean {
    return this.defaultPrevented;
  }
}

export default FormEvent;
