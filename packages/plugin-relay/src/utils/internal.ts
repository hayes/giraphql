import { SchemaTypes } from '@giraphql/core';
import { decodeGlobalID, encodeGlobalID } from '.';

export function internalEncodeGlobalID<Types extends SchemaTypes>(
  builder: GiraphQLSchemaTypes.SchemaBuilder<Types>,
  typename: string,
  id: bigint | number | string,
) {
  if (builder.options.relayOptions.encodeGlobalID) {
    return builder.options.relayOptions.encodeGlobalID(typename, id);
  }

  return encodeGlobalID(typename, id);
}

export function internalDecodeGlobalID<Types extends SchemaTypes>(
  builder: GiraphQLSchemaTypes.SchemaBuilder<Types>,
  globalID: string,
) {
  if (builder.options.relayOptions.decodeGlobalID) {
    return builder.options.relayOptions.decodeGlobalID(globalID);
  }

  return decodeGlobalID(globalID);
}
