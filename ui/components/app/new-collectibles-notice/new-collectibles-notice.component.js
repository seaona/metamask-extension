import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '../../ui/box';
import Dialog from '../../ui/dialog';
import Typography from '../../ui/typography/typography';
import {
  COLORS,
  TYPOGRAPHY,
  TEXT_ALIGN,
  FONT_WEIGHT,
  DISPLAY,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import Button from '../../ui/button';
import { EXPERIMENTAL_ROUTE } from '../../../helpers/constants/routes';

export default function NewCollectiblesNotice() {
  const t = useI18nContext();
  const history = useHistory();
  return (
    <Box marginBottom={8} className="new-collectibles-notice">
      <Dialog type="message" className="new-collectibles-notice__message">
        <button className="new-collectibles-notice__message__close-button" />
        <Box display={DISPLAY.FLEX}>
          <Box paddingTop={2}>
            <i style={{ fontSize: '1rem' }} className="fa fa-info-circle" />
          </Box>
          <Box paddingLeft={4}>
            <Typography
              color={COLORS.BLACK}
              align={TEXT_ALIGN.LEFT}
              variant={TYPOGRAPHY.Paragraph}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {t('newNFTsDetected')}
            </Typography>
            <Typography
              color={COLORS.BLACK}
              align={TEXT_ALIGN.LEFT}
              variant={TYPOGRAPHY.Paragraph}
              boxProps={{ marginBottom: 4 }}
            >
              {t('newNFTsDetectedInfo')}
            </Typography>
            <Button
              type="link"
              onClick={() => {
                history.push(EXPERIMENTAL_ROUTE);
              }}
            >
              <Typography
                // color={COLORS.BLACK}
                align={TEXT_ALIGN.LEFT}
                variant={TYPOGRAPHY.Paragraph}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                {t('selectNFTPrivacyPreference')}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
