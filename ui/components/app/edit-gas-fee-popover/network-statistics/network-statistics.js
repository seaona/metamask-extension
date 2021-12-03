import React from 'react';

import {
  COLORS,
  TYPOGRAPHY,
} from '../../../../helpers/constants/design-system';
import { useGasFeeContext } from '../../../../contexts/gasFee';
import I18nValue from '../../../ui/i18n-value';
import Typography from '../../../ui/typography/typography';

import { BaseFeeTooltip, PriorityFeeTooltip } from './tooltips';
import StatusSlider from './status-slider';

const NetworkStatistics = () => {
  const { gasFeeEstimates } = useGasFeeContext();

  return (
    <div className="network-statistics">
      <Typography
        color={COLORS.UI4}
        fontWeight="bold"
        margin={[3, 0]}
        tag={TYPOGRAPHY.H6}
        variant={TYPOGRAPHY.H8}
      >
        <I18nValue messageKey="networkStatus" />
      </Typography>
      <div className="network-statistics__info">
        <div className="network-statistics__info__field">
          <span className="network-statistics__info__field-data">
            <BaseFeeTooltip>
              {gasFeeEstimates?.estimatedBaseFee &&
                `${gasFeeEstimates?.estimatedBaseFee} GWEI`}
            </BaseFeeTooltip>
          </span>
          <span className="network-statistics__info__field-label">
            <I18nValue messageKey="baseFee" />
          </span>
        </div>
        <div className="network-statistics__info__separator" />
        <div className="network-statistics__info__field network-statistics__info__field--priority-fee">
          <span className="network-statistics__info__field-data">
            <PriorityFeeTooltip>0.5 - 22 GWEI</PriorityFeeTooltip>
          </span>
          <span className="network-statistics__info__field-label">
            <I18nValue messageKey="priorityFeeProperCase" />
          </span>
        </div>
        <div className="network-statistics__info__separator" />
        <div className="network-statistics__info__field">
          <StatusSlider />
        </div>
      </div>
    </div>
  );
};

export default NetworkStatistics;
