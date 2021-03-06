import { $, hide, show } from '../utils/DOM.js';
import {
  LOTTO_NUMBER_SEPARATOR,
  REMAINING_QUANTITY_TO_PURCHASE_MESSAGE,
  LOTTO_NUMBER_CHECK_MESSAGE,
} from '../constants.js';
import { getLottoNumberCheckMessage, renderCheckMessage } from '../model/LottoNumbersValidation.js';

export default class ManualLottoPurchaseInput {
  constructor({ isVisible, numOfLotto, updateLottoTickets }) {
    this.$container = $('.manual-lotto-purchase-section');
    this.$remainingCount = $('.remaining-count');
    this.$lottoNumberForm = $('.manual-lotto-purchase-form');
    this.$addLottoButton = $('.add-manual-lotto-button');
    this.$lottoNumCheckMessage = $('.lotto-number-check-message');
    this.$purchasedLottoList = $('.purchased-manual-lotto-list');

    this.isVisible = isVisible;
    this.numOfLotto = numOfLotto;
    this.lottoTicketNumbers = [];
    this.updateLottoTickets = updateLottoTickets;

    this.attachEvents();
  }

  attachEvents() {
    this.$lottoNumberForm.addEventListener('keyup', this.onChangeLottoNumberInput.bind(this));
    this.$lottoNumberForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.updatelottoTicketNumbers(e);
    });
  }

  onChangeLottoNumberInput(e) {
    if (e.target.type !== 'number') {
      return;
    }

    const lottoNumbers = Array.from(e.currentTarget.querySelectorAll('.lotto-number'))
      .filter(($input) => $input.value !== '')
      .map(($input) => Number($input.value));

    const checkMessage = getLottoNumberCheckMessage({
      type: 'lottoNumbers',
      numbers: lottoNumbers,
    });

    renderCheckMessage({
      $target: this.$lottoNumCheckMessage,
      $resultButton: this.$addLottoButton,
      checkMessage,
    });
  }

  updatelottoTicketNumbers({ target }) {
    const lottoNumbers = Array.from(target.querySelectorAll('.lotto-number')).map(($input) => $input.value);

    this.setState({ lottoTicketNumbers: [...this.lottoTicketNumbers, lottoNumbers] });
  }

  setState({ isVisible, numOfLotto, lottoTicketNumbers }) {
    this.isVisible = isVisible ?? this.isVisible;
    this.numOfLotto = numOfLotto ?? this.numOfLotto;
    this.lottoTicketNumbers = lottoTicketNumbers ?? this.lottoTicketNumbers;

    this.render();
  }

  createLottoList(lottoNumbers) {
    return `
      <li>
        <span>${lottoNumbers.join(LOTTO_NUMBER_SEPARATOR)}</span>
        <button type="button" class="remove-lotto-button ml-5 btn-transparent">삭제</button>
      </li>
    `;
  }

  render() {
    if (!this.isVisible) {
      hide(this.$container);
      return;
    }

    show(this.$container);
    this.$remainingCount.innerText = REMAINING_QUANTITY_TO_PURCHASE_MESSAGE(
      this.numOfLotto - this.lottoTicketNumbers.length,
      this.numOfLotto
    );
    this.$purchasedLottoList.innerHTML = this.lottoTicketNumbers
      .map((numbers) => this.createLottoList(numbers))
      .join('');
  }
}
