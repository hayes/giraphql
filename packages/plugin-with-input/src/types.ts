import {
  FieldNullability,
  InputFieldMap,
  InputFieldRef,
  InputRef,
  InputShapeFromFields,
  SchemaTypes,
  TypeParam,
} from '@giraphql/core';

export interface WithInputBuilderOptions<Types extends SchemaTypes> {
  inputArgOptions: Omit<
    GiraphQLSchemaTypes.ArgFieldOptions<Types, InputRef<{}>, true>,
    'fields' | 'required' | 'type'
  >;
}

export type WithInputInputOptions<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
  InputName extends string
> = Omit<GiraphQLSchemaTypes.InputObjectTypeOptions<Types, Fields>, 'fields'> & {
  name?: string;
  argName?: InputName;
  inputFields: (t: GiraphQLSchemaTypes.InputFieldBuilder<Types, 'InputObject'>) => Fields;
};

export type QueryFieldWithInputOptions<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
  Type extends TypeParam<Types>,
  Nullable extends FieldNullability<Type>,
  InputName extends string,
  ResolveReturnShape
> = Omit<
  GiraphQLSchemaTypes.QueryFieldOptions<
    Types,
    Type,
    Nullable,
    {
      [K in InputName]: InputFieldRef<InputShapeFromFields<Fields>>;
    },
    ResolveReturnShape
  >,
  'args'
>;

export type MutationFieldWithInputOptions<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
  Type extends TypeParam<Types>,
  Nullable extends FieldNullability<Type>,
  InputName extends string,
  ResolveReturnShape
> = Omit<
  GiraphQLSchemaTypes.MutationFieldOptions<
    Types,
    Type,
    Nullable,
    {
      [K in InputName]: InputFieldRef<InputShapeFromFields<Fields>>;
    },
    ResolveReturnShape
  >,
  'args'
>;

export type SubscriptionFieldWithInputOptions<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
  Type extends TypeParam<Types>,
  Nullable extends FieldNullability<Type>,
  InputName extends string,
  ResolveShape,
  ResolveReturnShape
> = Omit<
  GiraphQLSchemaTypes.SubscriptionFieldOptions<
    Types,
    Type,
    Nullable,
    {
      [K in InputName]: InputFieldRef<InputShapeFromFields<Fields>>;
    },
    ResolveShape,
    ResolveReturnShape
  >,
  'args'
>;

export type ObjectFieldWithInputOptions<
  Types extends SchemaTypes,
  ParentShape,
  Fields extends InputFieldMap,
  Type extends TypeParam<Types>,
  Nullable extends FieldNullability<Type>,
  InputName extends string,
  ResolveReturnShape
> = Omit<
  GiraphQLSchemaTypes.ObjectFieldOptions<
    Types,
    ParentShape,
    Type,
    Nullable,
    {
      [K in InputName]: InputFieldRef<InputShapeFromFields<Fields>>;
    },
    ResolveReturnShape
  >,
  'args'
>;

export type InterfaceFieldWithInputOptions<
  Types extends SchemaTypes,
  ParentShape,
  Fields extends InputFieldMap,
  Type extends TypeParam<Types>,
  Nullable extends FieldNullability<Type>,
  InputName extends string,
  ResolveReturnShape
> = Omit<
  GiraphQLSchemaTypes.InterfaceFieldOptions<
    Types,
    ParentShape,
    Type,
    Nullable,
    {
      [K in InputName]: InputFieldRef<InputShapeFromFields<Fields>>;
    },
    ResolveReturnShape
  >,
  'args'
>;
