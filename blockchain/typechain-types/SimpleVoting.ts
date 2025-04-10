/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface SimpleVotingInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "clearVote"
      | "getVotes"
      | "hasVoted"
      | "numChoices"
      | "vote"
      | "voteCounts"
      | "votes"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Voted"): EventFragment;

  encodeFunctionData(functionFragment: "clearVote", values?: undefined): string;
  encodeFunctionData(functionFragment: "getVotes", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hasVoted",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "numChoices",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "vote", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "voteCounts",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "votes", values: [AddressLike]): string;

  decodeFunctionResult(functionFragment: "clearVote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getVotes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasVoted", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "numChoices", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "voteCounts", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "votes", data: BytesLike): Result;
}

export namespace VotedEvent {
  export type InputTuple = [
    voter: AddressLike,
    choice: BigNumberish,
    quantity: BigNumberish
  ];
  export type OutputTuple = [voter: string, choice: bigint, quantity: bigint];
  export interface OutputObject {
    voter: string;
    choice: bigint;
    quantity: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SimpleVoting extends BaseContract {
  connect(runner?: ContractRunner | null): SimpleVoting;
  waitForDeployment(): Promise<this>;

  interface: SimpleVotingInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  clearVote: TypedContractMethod<[], [void], "nonpayable">;

  getVotes: TypedContractMethod<[], [bigint[]], "view">;

  hasVoted: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  numChoices: TypedContractMethod<[], [bigint], "view">;

  vote: TypedContractMethod<[choice: BigNumberish], [void], "nonpayable">;

  voteCounts: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  votes: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "clearVote"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getVotes"
  ): TypedContractMethod<[], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "hasVoted"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "numChoices"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "vote"
  ): TypedContractMethod<[choice: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "voteCounts"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "votes"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  getEvent(
    key: "Voted"
  ): TypedContractEvent<
    VotedEvent.InputTuple,
    VotedEvent.OutputTuple,
    VotedEvent.OutputObject
  >;

  filters: {
    "Voted(address,uint256,int8)": TypedContractEvent<
      VotedEvent.InputTuple,
      VotedEvent.OutputTuple,
      VotedEvent.OutputObject
    >;
    Voted: TypedContractEvent<
      VotedEvent.InputTuple,
      VotedEvent.OutputTuple,
      VotedEvent.OutputObject
    >;
  };
}
