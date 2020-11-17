import React from 'react';
import branch, {RegisterViewEvent, BranchEvent} from 'react-native-branch';
import {logToConsole} from '../helpers';
const defaultBUO = {
  title: 'DaapApp Universal Object',
};

export class BranchClass {
  buo = null;
  constructor() {
    this.createBranchUniversalObject = this.createBranchUniversalObject.bind(
      this,
    );
    this.generateShortUrl = this.generateShortUrl.bind(this);
    this.listOnSpotlight = this.listOnSpotlight.bind(this);
    this.showShareSheet = this.showShareSheet.bind(this);
    this.redeemRewards = this.redeemRewards.bind(this);
    this.loadRewards = this.loadRewards.bind(this);
    this.getCreditHistory = this.getCreditHistory.bind(this);
    this.userCompletedAction = this.userCompletedAction.bind(this);
    this.sendCommerceEvent = this.sendCommerceEvent.bind(this);
    this.disableTracking = this.disableTracking.bind(this);
    this.isTrackingDisabled = this.isTrackingDisabled.bind(this);
    this.logStandardEvent = this.logStandardEvent.bind(this);
    this.logCustomEvent = this.logCustomEvent.bind(this);
    this.releaseBranchUniversalObject = this.releaseBranchUniversalObject.bind(
      this,
    );
    this.getBranchUniversalObject = this.getBranchUniversalObject.bind(this);
  }
  async createBranchUniversalObject() {
    try {
      let result = await branch.createBranchUniversalObject('abc', defaultBUO);
      this.releaseBranchUniversalObject();
      this.buo = result;
      this.addResult('success', 'createBranchUniversalObject', result);
    } catch (err) {
      this.addResult('error', 'createBranchUniversalObject', err.toString());
    }
  }
  getBranchUniversalObject() {
    return this.buo;
  }
  releaseBranchUniversalObject() {
    if (this.buo) {
      this.buo.release();
    }
  }
  async generateShortUrl() {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }
    try {
      let result = await this.buo.generateShortUrl();
      this.addResult('success', 'generateShortUrl', result);
    } catch (err) {
      this.addResult('error', 'generateShortUrl', err.toString());
    }
  }

  async listOnSpotlight() {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }
    try {
      let result = await this.buo.listOnSpotlight();
      this.addResult('success', 'listOnSpotlight', result);
    } catch (err) {
      this.addResult('error', 'listOnSpotlight', err.toString());
    }
  }

  async showShareSheet() {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }
    try {
      let result = await this.buo.showShareSheet();
      this.addResult('success', 'showShareSheet', result);
    } catch (err) {
      this.addResult('error', 'showShareSheet', err.toString());
    }
  }

  async redeemRewards(bucket) {
    try {
      let result = await branch.redeemRewards(5, bucket);
      this.addResult('success', 'redeemRewards', result);
    } catch (err) {
      this.addResult('error', 'redeemRewards', err.toString());
    }
  }

  async loadRewards() {
    try {
      let result = await branch.loadRewards();
      this.addResult('success', 'loadRewards', result);
    } catch (err) {
      this.addResult('error', 'loadRewards', err.toString());
    }
  }

  async getCreditHistory() {
    try {
      let result = await branch.getCreditHistory();
      this.addResult('success', 'getCreditHistory', result);
    } catch (err) {
      this.addResult('error', 'getCreditHistory', err.toString());
    }
  }

  async userCompletedAction() {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }
    try {
      let result = await this.buo.userCompletedAction(RegisterViewEvent);
      this.addResult('success', 'userCompletedAction', result);
    } catch (err) {
      this.addResult('error', 'userCompletedAction', err.toString());
    }
  }

  async sendCommerceEvent(revenue: number = 0) {
    try {
      let result = await branch.sendCommerceEvent(revenue, {key: 'value'});
      this.addResult('success', 'sendCommerceEvent', result);
    } catch (err) {
      this.addResult('error', 'sendCommerceEvent', err.toString());
    }
  }

  async disableTracking() {
    try {
      let disabled = await branch.isTrackingDisabled();
      branch.disableTracking(!disabled);
      disabled = await branch.isTrackingDisabled();
      let status = disabled ? 'Tracking Disabled' : 'Tracking Enabled';
      this.addResult('success', 'disableTracking', status);
    } catch (err) {
      this.addResult('error', 'disableTracking', err.toString());
    }
  }

  async isTrackingDisabled() {
    try {
      let disabled = await branch.isTrackingDisabled();
      let status = disabled ? 'Tracking is Disabled' : 'Tracking is Enabled';
      this.addResult('success', 'isTrackingDisabled', status);
    } catch (err) {
      this.addResult('error', 'isTrackingDisabled', err.toString());
    }
  }

  async logStandardEvent() {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }
    try {
      let branchEvent = new BranchEvent(BranchEvent.Purchase, this.buo, {
        transactionID: '12344555',
        currency: 'USD',
        revenue: 1.5,
        shipping: 10.2,
        tax: 12.3,
        coupon: 'test_coupon',
        affiliation: 'test_affiliation',
        description: 'Test purchase event',
        searchQuery: 'test keyword',
        customData: {
          Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
          Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
        },
      });
      branchEvent.logEvent();
      this.addResult('success', 'sendStandardEvent', branchEvent);
    } catch (err) {
      // logToConsole('sendStandardEvent err', [err]);
      this.addResult('error', 'sendStandardEvent', err.toString());
    }
  }
  async logCustomEvent(
    eventName: string = '',
    event: any = {
      affiliation: '',
      description: '',
      searchQuery: '',
      customData: {},
    },
  ) {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }
    try {
      let branchEvent = new BranchEvent(eventName, this.buo, {
        // transactionID: '12344555',
        // currency: 'USD',
        // revenue: 1.5,
        // shipping: 10.2,
        // tax: 12.3,
        // coupon: 'first_transaction__coupon',
        // affiliation: 'first_transaction_affiliation',
        // description: event.description,
        // searchQuery: 'test keyword',
        // customData: {
        //   Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        //   Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
        // },
        ...event,
      });
      branchEvent.logEvent();
      this.addResult('success', 'sendStandardEvent', branchEvent);
    } catch (err) {
      // logToConsole('sendStandardEvent err', [err]);
      this.addResult('error', 'sendStandardEvent', err.toString());
    }
  }

  addResult(type, slug, payload) {
    // let result = {type, slug, payload};
    // this.setState({
    //   results: [result, ...this.state.results].slice(0, 10),
    // });
  }
}
