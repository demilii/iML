source activate styletransferml5
cd /home/u25158/train_style_transfer_devCloud/

export PYTHONUNBUFFERED=0
python style.py --style images/galaxy2.jpeg \
  --checkpoint-dir checkpoints/ \
  --model-dir models/ \
  --test images/violetaparra.jpg \
  --test-dir tests/ \
  --content-weight 1.5e1 \
  --checkpoint-iterations 1 \
  --batch-size 64
