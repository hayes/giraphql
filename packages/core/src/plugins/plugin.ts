import { GraphQLFieldResolver, GraphQLSchema, GraphQLTypeResolver } from 'graphql';
import {
  SchemaTypes,
  GiraphQLOutputFieldConfig,
  GiraphQLTypeConfig,
  GiraphQLInputFieldConfig,
  GiraphQLInterfaceTypeConfig,
  GiraphQLUnionTypeConfig,
  GiraphQLEnumValueConfig,
} from '../types';
import BaseFieldWrapper from './field-wrapper';

export { BaseFieldWrapper };

export class BasePlugin<Types extends SchemaTypes, T extends object = object> {
  name: keyof GiraphQLSchemaTypes.Plugins<Types>;

  builder: GiraphQLSchemaTypes.SchemaBuilder<Types>;

  private requestDataMap = new WeakMap<Types['Context'], T>();

  constructor(
    builder: GiraphQLSchemaTypes.SchemaBuilder<Types>,
    name: keyof GiraphQLSchemaTypes.Plugins<Types>,
  ) {
    this.name = name;
    this.builder = builder;
  }

  onTypeConfig(typeConfig: GiraphQLTypeConfig) {}

  onOutputFieldConfig(fieldConfig: GiraphQLOutputFieldConfig<Types>) {}

  onInputFieldConfig(fieldConfig: GiraphQLInputFieldConfig<Types>) {}

  onEnumValueConfig(valueConfig: GiraphQLEnumValueConfig<Types>) {}

  beforeBuild(options: GiraphQLSchemaTypes.BuildSchemaOptions<Types>) {}

  afterBuild(schema: GraphQLSchema, options: GiraphQLSchemaTypes.BuildSchemaOptions<Types>) {}

  /**
   * @deprecated This will be replaced by by wrapResolve, wrapSubscribe, and wrapResolveType
   */
  wrapOutputField(
    fieldConfig: GiraphQLOutputFieldConfig<Types>,
    buildOptions: GiraphQLSchemaTypes.BuildSchemaOptions<Types>,
  ): BaseFieldWrapper<Types> | BaseFieldWrapper<Types>[] | null {
    return null;
  }

  wrapResolve(
    resolver: GraphQLFieldResolver<unknown, Types['Context'], object>,
    fieldConfig: GiraphQLOutputFieldConfig<Types>,
    buildOptions: GiraphQLSchemaTypes.BuildSchemaOptions<Types>,
  ): GraphQLFieldResolver<unknown, Types['Context'], object> {
    return resolver;
  }

  wrapSubscribe(
    subscribe: GraphQLFieldResolver<unknown, Types['Context'], object> | undefined,
    fieldConfig: GiraphQLOutputFieldConfig<Types>,
    buildOptions: GiraphQLSchemaTypes.BuildSchemaOptions<Types>,
  ): GraphQLFieldResolver<unknown, Types['Context'], object> | undefined {
    return subscribe;
  }

  wrapResolveType(
    resolveType: GraphQLTypeResolver<unknown, Types['Context']>,
    typeConfig: GiraphQLInterfaceTypeConfig | GiraphQLUnionTypeConfig,
    buildOptions: GiraphQLSchemaTypes.BuildSchemaOptions<Types>,
  ): GraphQLTypeResolver<unknown, Types['Context']> {
    return resolveType;
  }

  /**
   * @deprecated This will be replaced by by wrapResolve, wrapSubscribe, and wrapResolveType
   */
  usesFieldWrapper() {
    return this.wrapOutputField !== BasePlugin.prototype.wrapOutputField;
  }

  protected createRequestData(context: Types['Context']): T {
    throw new Error('createRequestData not implemented');
  }

  protected requestData(context: Types['Context']): T {
    if (!this.requestDataMap.has(context)) {
      this.requestDataMap.set(context, this.createRequestData(context))!;
    }

    return this.requestDataMap.get(context)!;
  }
}
